#!/usr/bin/env python3
"""
Importador simplificado - Usar APIs o fuentes más confiables
"""

from supabase import create_client
from datetime import datetime
import os

SUPABASE_URL = "https://ksiiidnvtktlowlhtebs.supabase.co"
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

# Noticias de ejemplo con imágenes de Unsplash (Mundial/Fútbol)
NOTICIAS_EJEMPLO = [
    {
        'title': 'México confirma sedes para el Mundial 2026: CDMX, Guadalajara y Monterrey',
        'excerpt': 'Las tres ciudades mexicanas preparan sus estadios para recibir a las mejores selecciones del mundo.',
        'cover_image_url': 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1200&q=80',
        'category': 'Sedes',
    },
    {
        'title': 'Estadio Azteca: Historia y legado para el Mundial 2026',
        'excerpt': 'El emblemático recinto que albergará la inauguración se renueva para la Copa del Mundo.',
        'cover_image_url': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80',
        'category': 'Estadios',
    },
    {
        'title': 'Selección Mexicana intensifica preparación rumbo al Mundial',
        'excerpt': 'El Tri trabaja en concentración para llegar en óptimas condiciones al torneo.',
        'cover_image_url': 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=1200&q=80',
        'category': 'Selección',
    },
    {
        'title': 'Guadalajara se viste de gala para recibir el Mundial 2026',
        'excerpt': 'El Estadio Akron será una de las sedes principales del torneo en México.',
        'cover_image_url': 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=80',
        'category': 'Sedes',
    },
    {
        'title': 'Monterrey: La sede del norte lista para el Mundial',
        'excerpt': 'El Estadio BBVA confirma su capacidad para albergar partidos de alto nivel.',
        'cover_image_url': 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1200&q=80',
        'category': 'Sedes',
    },
]

def create_slug(title):
    import re
    slug = title.lower()
    slug = re.sub(r'[áàäâ]', 'a', slug)
    slug = re.sub(r'[éèëê]', 'e', slug)
    slug = re.sub(r'[íìïî]', 'i', slug)
    slug = re.sub(r'[óòöô]', 'o', slug)
    slug = re.sub(r'[úùüû]', 'u', slug)
    slug = re.sub(r'[ñ]', 'n', slug)
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    return slug.strip('-')[:100]

print("="*70)
print("🚀 IMPORTADOR SIMPLIFICADO DE NOTICIAS")
print("="*70)

if not SUPABASE_KEY:
    print("\n❌ ERROR: SUPABASE_KEY no configurada")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
print("✅ Conectado a Supabase\n")

imported = 0

for noticia in NOTICIAS_EJEMPLO:
    slug = create_slug(noticia['title'])
    
    # Verificar si ya existe
    existing = supabase.table('articles').select('id').eq('slug', slug).execute()
    if existing.data:
        print(f"⏭️  Ya existe: {noticia['title'][:50]}...")
        continue
    
    # Preparar datos completos
    article_data = {
        'title': noticia['title'],
        'slug': slug,
        'content': noticia['excerpt'] + '\n\nContenido completo próximamente...',
        'excerpt': noticia['excerpt'],
        'cover_image_url': noticia['cover_image_url'],
        'author': 'Redacción Mundial 2026',
        'category': noticia['category'],
        'tags': ['Mundial 2026', 'México'],
        'published_at': datetime.now().isoformat(),
        'is_featured': False,
        'views': 0
    }
    
    supabase.table('articles').insert(article_data).execute()
    print(f"✅ 🖼️  {noticia['title'][:60]}...")
    imported += 1

print("\n" + "="*70)
print("🎉 RESUMEN")
print("="*70)
print(f"📊 Noticias importadas: {imported}")
print("✅ ¡Listo! Refresca /news para ver las noticias con imágenes")
