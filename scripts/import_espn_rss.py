#!/usr/bin/env python3
"""
RSS Importer MEJORADO v2.0
- Maneja redirects correctamente
- User-Agent mejorado
- Múltiples fuentes RSS
- Extracción robusta de imágenes
"""

import feedparser
import requests
from supabase import create_client
import os
from datetime import datetime
import time
from urllib.parse import urlparse
import re

# ============================================
# CONFIGURACIÓN
# ============================================

SUPABASE_URL = "https://ksiiidnvtktlowlhtebs.supabase.co"
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

# RSS Feeds actualizados y VERIFICADOS con imágenes
RSS_FEEDS = {
    "FourFourTwo": "https://www.fourfourtwo.com/feeds/all",
    "The Athletic": "https://theathletic.com/feed/",
    "90min": "https://www.90min.com/posts.rss",
    "BBC Sport Football": "https://feeds.bbci.co.uk/sport/football/rss.xml",
    "Sky Sports Football": "https://www.skysports.com/rss/12040",
}

# Headers mejorados para evitar bloqueos
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*',
    'Accept-Language': 'es-MX,es;q=0.9,en;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
}

# ============================================
# FUNCIONES AUXILIARES
# ============================================

def extract_image_from_entry(entry):
    """
    Extrae imagen de múltiples formatos RSS con prioridad
    """
    # Prioridad 1: media:content (ESPN, TUDN)
    if hasattr(entry, 'media_content') and entry.media_content:
        for media in entry.media_content:
            url = media.get('url', '')
            if url and any(ext in url.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                return url
    
    # Prioridad 2: media:thumbnail
    if hasattr(entry, 'media_thumbnail') and entry.media_thumbnail:
        return entry.media_thumbnail[0].get('url')
    
    # Prioridad 3: enclosures
    if hasattr(entry, 'enclosures') and entry.enclosures:
        for enc in entry.enclosures:
            if 'image' in enc.get('type', ''):
                return enc.get('href')
    
    # Prioridad 4: Buscar en summary/description
    for field in ['summary', 'description', 'content']:
        if hasattr(entry, field):
            text = getattr(entry, field)
            if isinstance(text, list):
                text = text[0].get('value', '') if text else ''
            
            # Buscar URLs de imágenes
            img_patterns = [
                r'<img[^>]+src=["\']([^"\']+)["\']',
                r'https?://[^\s]+\.(?:jpg|jpeg|png|webp)',
            ]
            
            for pattern in img_patterns:
                matches = re.findall(pattern, str(text), re.IGNORECASE)
                if matches:
                    return matches[0]
    
    return None


def create_slug(title):
    """Crear slug SEO-friendly"""
    slug = title.lower()
    # Reemplazar acentos
    replacements = {
        'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
        'ñ': 'n', 'ü': 'u'
    }
    for old, new in replacements.items():
        slug = slug.replace(old, new)
    
    # Solo alfanuméricos y guiones
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    slug = slug.strip('-')
    return slug[:100]


def fetch_rss(url, timeout=15):
    """
    Descarga RSS con manejo robusto de errores
    """
    try:
        # Configurar sesión con redirects
        session = requests.Session()
        session.max_redirects = 10
        
        response = session.get(
            url,
            headers=HEADERS,
            timeout=timeout,
            allow_redirects=True,
            verify=True
        )
        response.raise_for_status()
        
        # Parsear con feedparser
        feed = feedparser.parse(response.content)
        
        if feed.bozo and not feed.entries:
            print(f"   ⚠️  Feed malformado o vacío")
            return None
        
        return feed
        
    except requests.exceptions.TooManyRedirects:
        print(f"   ❌ Demasiados redirects")
        return None
    except requests.exceptions.Timeout:
        print(f"   ❌ Timeout después de {timeout}s")
        return None
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Error de conexión: {str(e)[:50]}")
        return None
    except Exception as e:
        print(f"   ❌ Error inesperado: {str(e)[:50]}")
        return None


def import_news_from_rss(supabase, rss_url, source_name):
    """
    Importa noticias desde un RSS feed
    """
    print(f"\n{'='*70}")
    print(f"📰 {source_name}")
    print(f"{'='*70}")
    print(f"📡 {rss_url}")
    
    # Descargar RSS
    feed = fetch_rss(rss_url)
    if not feed or not feed.entries:
        return 0
    
    print(f"✅ {len(feed.entries)} entradas encontradas")
    
    imported_count = 0
    skipped_count = 0
    error_count = 0
    
    for entry in feed.entries[:20]:  # Limitar a 20 por fuente
        try:
            title = entry.get('title', 'Sin título').strip()
            if not title or len(title) < 10:
                continue
            
            slug = create_slug(title)
            
            # Verificar duplicado
            existing = supabase.table('articles')\
                .select('id')\
                .eq('slug', slug)\
                .execute()
            
            if existing.data:
                skipped_count += 1
                continue
            
            # Extraer datos
            excerpt = entry.get('summary', '')[:500] if entry.get('summary') else None
            content_raw = entry.get('content', [{}])[0].get('value', entry.get('summary', ''))
            content = re.sub(r'<[^>]+>', '', content_raw)[:5000]  # Limpiar HTML
            
            # Extraer imagen
            cover_image_url = extract_image_from_entry(entry)
            
            # Fecha de publicación
            pub_date = entry.get('published', entry.get('updated', ''))
            published_at = None
            if pub_date:
                try:
                    from dateutil import parser
                    published_at = parser.parse(pub_date).isoformat()
                except:
                    published_at = datetime.now().isoformat()
            else:
                published_at = datetime.now().isoformat()
            
            # Preparar artículo
            article_data = {
                'title': title,
                'slug': slug,
                'content': content,
                'excerpt': excerpt,
                'cover_image_url': cover_image_url,
                'author': source_name,
                'category': 'Deportes',
                'tags': ['Mundial 2026', 'Fútbol'],
                'published_at': published_at,
                'is_featured': False,
                'views': 0
            }
            
            # Insertar en Supabase
            supabase.table('articles').insert(article_data).execute()
            
            # Mostrar resultado
            icon = "🖼️ " if cover_image_url else "📄"
            print(f"  ✅ {icon} {title[:65]}...")
            
            imported_count += 1
            
        except Exception as e:
            error_count += 1
            print(f"  ❌ Error: {str(e)[:50]}")
            continue
    
    # Resumen
    print(f"\n📊 Resumen {source_name}:")
    print(f"   ✅ Importadas: {imported_count}")
    print(f"   ⏭️  Omitidas: {skipped_count}")
    if error_count > 0:
        print(f"   ❌ Errores: {error_count}")
    
    return imported_count


# ============================================
# MAIN
# ============================================

def main():
    """Función principal"""
    
    print("="*70)
    print("🚀 RSS IMPORTER v2.0 - MEJORADO")
    print("="*70)
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*70)
    
    # Validar Service Role Key
    if not SUPABASE_KEY:
        print("\n❌ ERROR: SUPABASE_KEY no configurada")
        print("\n💡 Ejecuta:")
        print("   export SUPABASE_KEY='tu_service_role_key'")
        return
    
    # Conectar a Supabase
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Conectado a Supabase")
    except Exception as e:
        print(f"❌ Error conectando: {e}")
        return
    
    # Importar desde cada fuente
    total_imported = 0
    successful_sources = 0
    
    for source_name, rss_url in RSS_FEEDS.items():
        imported = import_news_from_rss(supabase, rss_url, source_name)
        if imported > 0:
            successful_sources += 1
        total_imported += imported
        time.sleep(2)  # Pausa entre fuentes
    
    # Resumen final
    print("\n" + "="*70)
    print("🎉 RESUMEN FINAL")
    print("="*70)
    print(f"📊 Total importado: {total_imported} noticias")
    print(f"📚 Fuentes exitosas: {successful_sources}/{len(RSS_FEEDS)}")
    print("="*70)
    
    if total_imported > 0:
        print("\n✅ ¡Listo! Refresca /news para ver las nuevas noticias")
    else:
        print("\n⚠️  No se importaron noticias nuevas")
        print("💡 Verifica las URLs de RSS o intenta más tarde")


if __name__ == "__main__":
    main()
