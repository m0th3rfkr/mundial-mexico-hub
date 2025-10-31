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
from urllib.parse import urlparse
import time

# ============================================
# CONFIGURACIÓN
# ============================================

SUPABASE_URL = "https://ksiiidnvtktlowlhtebs.supabase.co"
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

# RSS Feeds con soporte de imágenes
RSS_FEEDS = {
    "ESPN Deportes": "https://www.espn.com.mx/espndeportes/rss",
    "ESPN Fútbol": "https://www.espn.com.mx/futbol/rss",
    "Marca México": "https://www.marca.com/rss/portada.xml",
    "RÉCORD": "https://www.record.com.mx/rss/portada",
    "Mediotiempo": "https://www.mediotiempo.com/rss/portada",
}

# Headers para evitar bloqueos
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml'
}

# ============================================
# FUNCIONES
# ============================================

def extract_image_from_entry(entry):
    """
    Extrae la URL de imagen de diferentes formatos RSS
    """
    # Método 1: media:content (ESPN, muchos RSS)
    if hasattr(entry, 'media_content') and entry.media_content:
        return entry.media_content[0].get('url')
    
    # Método 2: media:thumbnail
    if hasattr(entry, 'media_thumbnail') and entry.media_thumbnail:
        return entry.media_thumbnail[0].get('url')
    
    # Método 3: enclosure (podcasts/multimedia)
    if hasattr(entry, 'enclosures') and entry.enclosures:
        for enclosure in entry.enclosures:
            if 'image' in enclosure.get('type', ''):
                return enclosure.get('href')
    
    # Método 4: Buscar en el contenido HTML
    if hasattr(entry, 'content') and entry.content:
        content = entry.content[0].get('value', '')
        # Buscar tag img
        import re
        img_match = re.search(r'<img[^>]+src="([^"]+)"', content)
        if img_match:
            return img_match.group(1)
    
    # Método 5: summary/description con imágenes
    if hasattr(entry, 'summary'):
        import re
        img_match = re.search(r'<img[^>]+src="([^"]+)"', entry.summary)
        if img_match:
            return img_match.group(1)
    
    return None


def create_slug(title):
    """Crear slug desde título"""
    import re
    slug = title.lower()
    slug = re.sub(r'[áàäâ]', 'a', slug)
    slug = re.sub(r'[éèëê]', 'e', slug)
    slug = re.sub(r'[íìïî]', 'i', slug)
    slug = re.sub(r'[óòöô]', 'o', slug)
    slug = re.sub(r'[úùüû]', 'u', slug)
    slug = re.sub(r'[ñ]', 'n', slug)
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    slug = slug.strip('-')
    return slug[:100]  # Limitar longitud


def import_news_from_rss(supabase, rss_url, source_name):
    """
    Importa noticias desde un RSS feed a Supabase
    """
    print(f"\n🔍 Procesando: {source_name}")
    print(f"📡 URL: {rss_url}")
    
    try:
        # Descargar RSS con headers
        response = requests.get(rss_url, headers=HEADERS, timeout=10)
        response.raise_for_status()
        
        # Parsear RSS
        feed = feedparser.parse(response.content)
        
        if not feed.entries:
            print(f"⚠️  No se encontraron entradas en el RSS")
            return 0
        
        print(f"📰 Encontradas {len(feed.entries)} noticias")
        imported_count = 0
        
        for entry in feed.entries:
            try:
                title = entry.get('title', 'Sin título')
                slug = create_slug(title)
                
                # Verificar si ya existe
                existing = supabase.table('articles')\
                    .select('id')\
                    .eq('slug', slug)\
                    .execute()
