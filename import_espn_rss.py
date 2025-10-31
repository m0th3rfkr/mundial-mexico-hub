#!/usr/bin/env python3
"""
🏆 IMPORTADOR DE NOTICIAS ESPN RSS → SUPABASE
==============================================
Importa noticias deportivas desde ESPN RSS Feed a la tabla 'articles' en Supabase

AUTOR: Mundial México Hub Team
FECHA: Octubre 2025
"""

import os
import sys
from datetime import datetime
import re
from typing import Dict, List, Optional
import feedparser
import requests
from supabase import create_client, Client
from slugify import slugify

# ============================================
# CONFIGURACIÓN
# ============================================

# URLs de RSS de ESPN y otras fuentes deportivas (en orden de prioridad)
ESPN_RSS_FEEDS = [
    {
        "name": "ESPN Deportes - General",
        "url": "https://www.espn.com/espn/rss/news",
        "category": "Deportes"
    },
    {
        "name": "ESPN Soccer/Fútbol",
        "url": "https://www.espn.com/espn/rss/soccer/news",
        "category": "Fútbol"
    },
    {
        "name": "Marca - Fútbol",
        "url": "https://e00-marca.uecdn.es/rss/futbol/primera.xml",
        "category": "Fútbol"
    },
    {
        "name": "AS - Fútbol",
        "url": "https://as.com/rss/futbol/portada.xml",
        "category": "Fútbol"
    },
    {
        "name": "Goal.com - Internacional",
        "url": "https://www.goal.com/feeds/es/news",
        "category": "Fútbol"
    }
]

# Configuración de Supabase
SUPABASE_URL = "https://ksiiidnvtktlowlhtebs.supabase.co"
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

# ============================================
# FUNCIONES AUXILIARES
# ============================================

def clean_html(text: str) -> str:
    """Limpia HTML y caracteres extraños del texto"""
    if not text:
        return ""
    
    # Eliminar tags HTML
    text = re.sub(r'<[^>]+>', '', text)
    
    # Decodificar entidades HTML
    text = text.replace('&nbsp;', ' ')
    text = text.replace('&amp;', '&')
    text = text.replace('&lt;', '<')
    text = text.replace('&gt;', '>')
    text = text.replace('&quot;', '"')
    text = text.replace('&#39;', "'")
    
    # Limpiar espacios múltiples
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text


def extract_excerpt(content: str, max_length: int = 200) -> str:
    """Extrae un excerpt limpio del contenido"""
    cleaned = clean_html(content)
    
    if len(cleaned) <= max_length:
        return cleaned
    
    # Cortar en el último punto antes del límite
    truncated = cleaned[:max_length]
    last_period = truncated.rfind('.')
    
    if last_period > max_length * 0.5:  # Si hay un punto razonable
        return truncated[:last_period + 1]
    
    return truncated + "..."


def extract_image_from_entry(entry: any, content: str = "") -> Optional[str]:
    """
    Extrae URL de imagen de un entry de RSS
    Busca en múltiples fuentes: media:content, enclosure, links, content HTML
    """
    
    # 1. Buscar en media:content (común en RSS de noticias)
    if hasattr(entry, 'media_content') and entry.media_content:
        for media in entry.media_content:
            if 'url' in media:
                url = media['url']
                # Verificar que sea una imagen
                if any(ext in url.lower() for ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp']):
                    return url
    
    # 2. Buscar en media:thumbnail
    if hasattr(entry, 'media_thumbnail') and entry.media_thumbnail:
        for thumb in entry.media_thumbnail:
            if 'url' in thumb:
                return thumb['url']
    
    # 3. Buscar en enclosures
    if hasattr(entry, 'enclosures') and entry.enclosures:
        for enclosure in entry.enclosures:
            if 'type' in enclosure and 'image' in enclosure['type']:
                if 'href' in enclosure:
                    return enclosure['href']
    
    # 4. Buscar en links
    if hasattr(entry, 'links'):
        for link in entry.links:
            if link.get('type', '').startswith('image/'):
                if 'href' in link:
                    return link['href']
    
    # 5. Buscar en el contenido HTML
    if content:
        # Buscar tags <img>
        img_match = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', content)
        if img_match:
            return img_match.group(1)
        
        # Buscar URLs de imágenes directas
        url_match = re.search(r'https?://[^\s<>"]+(?:jpg|jpeg|png|gif|webp)', content, re.IGNORECASE)
        if url_match:
            return url_match.group(0)
    
    return None


def article_exists(supabase: Client, slug: str) -> bool:
    """Verifica si un artículo ya existe por slug"""
    try:
        result = supabase.table("articles").select("id").eq("slug", slug).execute()
        return len(result.data) > 0
    except Exception:
        return False


def parse_category_from_link(link: str, default_category: str) -> str:
    """Intenta extraer categoría de la URL"""
    if 'soccer' in link or 'football' in link or 'futbol' in link:
        return "Fútbol"
    elif 'nfl' in link:
        return "NFL"
    elif 'nba' in link:
        return "NBA"
    elif 'mlb' in link:
        return "MLB"
    elif 'boxing' in link:
        return "Boxeo"
    
    return default_category


def determine_tags(title: str, content: str, link: str) -> List[str]:
    """Determina tags relevantes basados en el contenido"""
    tags = []
    
    # Tags base para Mundial 2026
    world_cup_keywords = ['mundial', 'world cup', '2026', 'fifa', 'mexico', 'méxico']
    text_to_search = (title + ' ' + content + ' ' + link).lower()
    
    if any(keyword in text_to_search for keyword in world_cup_keywords):
        tags.append("Mundial 2026")
    
    # Categorías deportivas
    if any(word in text_to_search for word in ['soccer', 'football', 'futbol', 'fútbol']):
        tags.append("Fútbol")
    
    if any(word in text_to_search for word in ['mexico', 'méxico', 'mexican']):
        tags.append("México")
    
    # Siempre incluir tag de ESPN
    tags.append("ESPN")
    
    return list(set(tags))  # Eliminar duplicados


# ============================================
# FUNCIÓN PRINCIPAL DE IMPORTACIÓN
# ============================================

def import_from_espn_rss(supabase: Client, rss_config: Dict) -> Dict[str, int]:
    """
    Importa noticias desde un feed RSS de ESPN
    
    Returns:
        Dict con estadísticas: {total, imported, skipped, errors}
    """
    print(f"\n{'='*60}")
    print(f"📡 Importando desde: {rss_config['name']}")
    print(f"🔗 URL: {rss_config['url']}")
    print(f"{'='*60}\n")
    
    # Headers para evitar bloqueos
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
    }
    
    try:
        # Descargar RSS con requests + headers
        response = requests.get(rss_config['url'], headers=headers, timeout=15)
        response.raise_for_status()
        
        # Parsear con feedparser
        feed = feedparser.parse(response.content)
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error al descargar RSS: {str(e)}")
        return {"total": 0, "imported": 0, "skipped": 0, "errors": 1}
    
    if not feed.entries:
        print(f"❌ No se encontraron noticias en el feed")
        return {"total": 0, "imported": 0, "skipped": 0, "errors": 0}
    
    stats = {
        "total": len(feed.entries),
        "imported": 0,
        "skipped": 0,
        "errors": 0
    }
    
    print(f"📰 Encontradas {stats['total']} noticias\n")
    
    for entry in feed.entries:
        try:
            # Generar slug único
            slug = slugify(entry.title)
            
            # Verificar si ya existe
            if article_exists(supabase, slug):
                print(f"⏭️  Ya existe: {entry.title[:60]}...")
                stats["skipped"] += 1
                continue
            
            # Extraer datos
            title = entry.title
            link = entry.link
            content = entry.get('summary', entry.get('description', ''))
            excerpt = extract_excerpt(content)
            cover_image = extract_image_from_entry(entry, content)
            category = parse_category_from_link(link, rss_config['category'])
            tags = determine_tags(title, content, link)
            
            # Determinar autor basado en la fuente
            author = entry.get('author', None)
            if not author:
                # Usar solo el nombre de la fuente (sin la parte después del -)
                author = rss_config['name'].split(' - ')[0]
            
            # Fecha de publicación
            published_at = None
            if hasattr(entry, 'published_parsed') and entry.published_parsed:
                try:
                    published_at = datetime(*entry.published_parsed[:6]).isoformat()
                except:
                    published_at = datetime.now().isoformat()
            else:
                published_at = datetime.now().isoformat()
            
            # Preparar datos para inserción
            article_data = {
                "title": title[:200],  # Límite de la DB
                "slug": slug[:200],
                "content": clean_html(content),
                "excerpt": excerpt,
                "cover_image_url": cover_image,
                "author": author,  # ← Cambio aquí
                "category": category,
                "tags": tags,
                "published_at": published_at,
                "is_featured": False,
                "views": 0
            }
            
            # Insertar en Supabase
            response = supabase.table("articles").insert(article_data).execute()
            
            if response.data:
                img_status = "🖼️" if cover_image else "📄"
                print(f"✅ {img_status} Importado: {title[:65]}...")
                stats["imported"] += 1
            else:
                print(f"⚠️  Error al importar: {title[:50]}")
                stats["errors"] += 1
                
        except Exception as e:
            print(f"❌ Error procesando entrada: {str(e)}")
            stats["errors"] += 1
            continue
    
    return stats


# ============================================
# MAIN
# ============================================

def main():
    """Función principal"""
    
    print("\n" + "="*60)
    print("🏆 IMPORTADOR ESPN RSS → SUPABASE")
    print("="*60)
    
    # Verificar SUPABASE_KEY
    if not SUPABASE_KEY:
        print("\n❌ ERROR: Variable de entorno SUPABASE_KEY no configurada")
        print("\n💡 Solución:")
        print("   export SUPABASE_KEY='tu_service_role_key'")
        print("\n📖 Consigue tu key en:")
        print("   https://supabase.com/dashboard/project/ksiiidnvtktlowlhtebs/settings/api")
        sys.exit(1)
    
    # Inicializar cliente Supabase
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Conectado a Supabase")
    except Exception as e:
        print(f"❌ Error conectando a Supabase: {str(e)}")
        sys.exit(1)
    
    # Estadísticas globales
    total_stats = {
        "total": 0,
        "imported": 0,
        "skipped": 0,
        "errors": 0
    }
    
    # Procesar cada feed RSS
    for rss_config in ESPN_RSS_FEEDS:
        feed_stats = import_from_espn_rss(supabase, rss_config)
        
        # Acumular estadísticas
        for key in total_stats:
            total_stats[key] += feed_stats[key]
    
    # Resumen final
    print("\n" + "="*60)
    print("📊 RESUMEN FINAL")
    print("="*60)
    print(f"📰 Total de noticias procesadas: {total_stats['total']}")
    print(f"✅ Importadas exitosamente: {total_stats['imported']}")
    print(f"⏭️  Saltadas (ya existían): {total_stats['skipped']}")
    print(f"❌ Errores: {total_stats['errors']}")
    print("="*60)
    
    if total_stats['imported'] > 0:
        print("\n🎉 ¡Importación completada exitosamente!")
        print("\n💡 Puedes ver las noticias en:")
        print("   https://lovable.dev/projects/130d2522-f5c7-46cf-8735-0f3265474abc")
    elif total_stats['skipped'] > 0:
        print("\n✅ Todas las noticias ya estaban importadas")
    else:
        print("\n⚠️  No se importaron noticias nuevas")


if __name__ == "__main__":
    main()
