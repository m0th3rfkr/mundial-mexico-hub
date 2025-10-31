#!/usr/bin/env python3
"""
Script de PRUEBA - Agregar UNA noticia con imagen
"""

from supabase import create_client
from datetime import datetime

# Configuración
SUPABASE_URL = "https://ksiiidnvtktlowlhtebs.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzaWlpZG52dGt0bG93bGh0ZWJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDgxMjEzMywiZXhwIjoyMDc2Mzg4MTMzfQ.z2qoL9pYqyFvYzO_wW-WRknxx-fo0Z7o69M-PezTOH0"

print("="*60)
print("🧪 PRUEBA: Agregar noticia CON imagen")
print("="*60)

# Conectar
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
print("✅ Conectado a Supabase")

# Noticia de prueba CON IMAGEN
noticia_prueba = {
    'title': '🧪 PRUEBA - Mundial 2026: México se prepara para la Copa del Mundo',
    'slug': 'prueba-mundial-2026-mexico-copa-mundo-' + str(int(datetime.now().timestamp())),
    'content': 'Esta es una noticia de prueba para verificar que las imágenes funcionan correctamente en la página de noticias.',
    'excerpt': 'Noticia de prueba con imagen para verificar funcionalidad',
    'cover_image_url': 'https://a.espncdn.com/photo/2024/1028/r1409156_1296x729_16-9.jpg',
    'author': 'Prueba Sistema',
    'category': 'Mundial 2026',
    'tags': ['Prueba', 'Mundial 2026'],
    'published_at': datetime.now().isoformat(),
    'is_featured': True,
    'views': 0
}

print(f"\n📝 Insertando noticia de prueba...")
print(f"   Título: {noticia_prueba['title']}")
print(f"   🖼️  Imagen: {noticia_prueba['cover_image_url']}")

result = supabase.table('articles').insert(noticia_prueba).execute()

print("\n✅ ¡NOTICIA INSERTADA!")
print("\n" + "="*60)
print("🎯 SIGUIENTE PASO:")
print("="*60)
print("1. Abre tu página /news en el navegador")
print("2. Refresca la página (Cmd+R)")
print("3. Deberías ver la noticia de PRUEBA con imagen")
print("="*60)
