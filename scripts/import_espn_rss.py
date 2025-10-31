#!/usr/bin/env python3
"""
Script para importar noticias desde RSS feeds (ESPN, Marca, etc.)
Extrae título, descripción e IMAGEN automáticamente
"""

import feedparser
import requests
from supabase import create_client
import os
from datetime import datetime
import time
import re

# Configuración
SUPABASE_URL = "https://ksiiidnvtktlowlhtebs.supabase.co"
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

RSS_FEEDS = {
    "ESPN Deportes": "https://www.espn.com.mx/espndeportes/rss",
    "ESPN Fútbol": "https://www.espn.com.mx/futbol/rss",
}

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml'
}

def extract_image_from_entry(entry):
    """Extrae la URL de imagen de diferentes formatos RSS"""
    if hasattr(entry, 'media_content') and entry.media_content:
        return entry.media_content[0].get('url')
    if hasattr(entry, 'media_thumbnail') and entry.media_thumbnail:
        return entry.media_thumbnail[0].get('url')
    if hasattr(entry, 'enclosures') and entry.enclosures:
        for enclosure in entry.enclosures:
            if 'image' in enclosure.get('type', ''):
                return enclosure.get('href')
    if hasattr(entry, 'content') and entry.content:
        content = entry.content[0].get('value', '')
        img_match = re.search(r'<img[^>]+src="([^"]+)"', content)
        if img_match:
            return img_match.group(1)
    if hasattr(entry, 'summary'):
        img_match = re.search(r'<img[^>]+src="([^"]+)"', entry.summary)
        if img_match:
            return img_match.group(1)
    return None

def create_slug(title):
    """Crear slug desde título"""
    slug = title.lower()
    slug = re.sub(r'[áàäâ]', 'a', slug)
    slug = re.sub(r'[éèëê]', 'e', slug)
    slug = re.sub(r'[íìïî]', 'i', slug)
    slug = re.sub(r'[óòöô]', 'o', slug)
    slug = re.sub(r'[úùüû]', 'u', slug)
    slug = re.sub(r'[ñ]', 'n', slug)
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    slug = slug.strip('-')
    return slug[:100]

def import_news_from_rss(supabase, rss_url, source_name):
    """Importa noticias desde un RSS feed a Supabase"""
    print(f"\n🔍 Procesando: {source_name}")
    print(f"📡 URL: {rss_url}")
    
    try:
        response = requests.get(rss_url, headers=HEADERS, timeout=10)
        response.raise_for_status()
        feed = feedparser.parse(response.content)
        
        if not feed.entries:
            print(f"⚠️  No se encontraron entradas")
            return 0
        
        print(f"📰 Encontradas {len(feed.entries)} noticias")
        imported_count = 0
        
        for entry in feed.entries:
            try:
                title = entry.get('title', 'Sin título')
                slug = create_slug(title)
                
                existing = supabase.table('articles').select('id').eq('slug', slug).execute()
                if existing.data:
                    print(f"  ⏭️  Ya existe: {title[:50]}...")
                    continue
                
                excerpt = entry.get('summary', '')[:500] if entry.get('summary') else None
                content = entry.get('content', [{}])[0].get('value', entry.get('summary', ''))
                pub_date = entry.get('published', entry.get('updated', ''))
                cover_image_url = extract_image_from_entry(entry)
                
                published_at = None
                if pub_date:
                    try:
                        from dateutil import parser
                        published_at = parser.parse(pub_date).isoformat()
                    except:
                        published_at = datetime.now().isoformat()
                else:
                    published_at = datetime.now().isoformat()
                
                article_data = {
                    'title': title,
                    'slug': slug,
                    'content': content[:5000],
                    'excerpt': excerpt,
                    'cover_image_url': cover_image_url,
                    'author': source_name,
                    'category': 'Deportes',
                    'tags': ['Mundial 2026', 'Fútbol'],
                    'published_at': published_at,
                    'is_featured': False,
                    'views': 0
                }
                
                supabase.table('articles').insert(article_data).execute()
                status_icon = "🖼️ " if cover_image_url else "📄"
                print(f"  ✅ {status_icon} {title[:60]}...")
                if cover_image_url:
                    print(f"     🔗 {cover_image_url[:80]}...")
                imported_count += 1
            except Exception as e:
                print(f"  ❌ Error: {str(e)}")
                continue
        return imported_count
    except Exception as e:
        print(f"❌ Error descargando RSS: {str(e)}")
        return 0

def main():
    """Función principal"""
    print("="*70)
    print("🚀 IMPORTADOR DE NOTICIAS RSS CON IMÁGENES")
    print("="*70)
    
    if not SUPABASE_KEY:
        print("\n❌ ERROR: SUPABASE_KEY no configurada")
        return
    
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Conectado a Supabase")
    except Exception as e:
        print(f"❌ Error conectando: {e}")
        return
    
    total_imported = 0
    for source_name, rss_url in RSS_FEEDS.items():
        imported = import_news_from_rss(supabase, rss_url, source_name)
        total_imported += imported
        time.sleep(1)
    
    print("\n" + "="*70)
    print("🎉 RESUMEN FINAL")
    print("="*70)
    print(f"📊 Total importado: {total_imported} noticias")
    print(f"📚 Fuentes procesadas: {len(RSS_FEEDS)}")
    print("✅ ¡Proceso completado!")

if __name__ == "__main__":
    main()
