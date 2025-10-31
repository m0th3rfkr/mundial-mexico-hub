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
