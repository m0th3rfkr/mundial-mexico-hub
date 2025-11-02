"""
Script para enriquecer contenido de artículos
Extrae el contenido completo de los artículos desde sus URLs originales
"""

import requests
from bs4 import BeautifulSoup
from supabase import create_client
import os
import time
import re
from datetime import datetime

# Configuración
SUPABASE_URL = "https://ksiiidnvtktlowlhtebs.supabase.co"
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
}

def extract_article_content(url):
    """
    Extrae el contenido completo de un artículo desde su URL
    """
    try:
        print(f"   📥 Descargando: {url[:60]}...")
        response = requests.get(url, headers=HEADERS, timeout=10, allow_redirects=True)
        
        if response.status_code != 200:
            print(f"   ❌ Error {response.status_code}")
            return None
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Estrategias de extracción por fuente
        content_paragraphs = []
        
        # BBC Sport
        if 'bbc.co.uk' in url or 'bbc.com' in url:
            article = soup.find('article') or soup.find('div', {'data-component': 'text-block'})
            if article:
                content_paragraphs = article.find_all('p')
        
        # 90min
        elif '90min.com' in url:
            article = soup.find('div', class_='article-body') or soup.find('div', class_='entry-content')
            if article:
                content_paragraphs = article.find_all('p')
        
        # Sky Sports
        elif 'skysports.com' in url:
            # Intentar múltiples selectores
            article = (
                soup.find('div', class_='article__body') or 
                soup.find('div', class_='sdc-article-body') or
                soup.find('div', {'data-role': 'body'}) or
                soup.find('article')
            )
            if article:
                # Buscar todos los párrafos, excluyendo los de widgets
                content_paragraphs = [
                    p for p in article.find_all('p') 
                    if not p.find_parent('aside') and not p.find_parent('div', class_='widget')
                ]
        
        # Estrategia genérica
        else:
            # Intentar encontrar el artículo principal
            article = (
                soup.find('article') or 
                soup.find('div', class_=re.compile(r'article|content|post|entry', re.I)) or
                soup.find('main')
            )
            if article:
                content_paragraphs = article.find_all('p')
        
        # Extraer texto de los párrafos
        if content_paragraphs:
            text = '\n\n'.join([p.get_text().strip() for p in content_paragraphs if p.get_text().strip()])
            
            # Limpiar
            text = re.sub(r'\s+', ' ', text)  # Multiple spaces
            text = re.sub(r'\n\s*\n', '\n\n', text)  # Multiple newlines
            
            # Limitar a 15000 chars
            if len(text) > 15000:
                text = text[:15000] + "..."
            
            if len(text) > 200:  # Solo si es contenido sustancial
                print(f"   ✅ Extraído: {len(text)} caracteres")
                return text
        
        print(f"   ⚠️  No se pudo extraer contenido")
        return None
        
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return None

def enhance_articles(limit=10):
    """
    Mejora el contenido de artículos que tienen poco texto
    """
    print("="*70)
    print("🔧 ENRIQUECEDOR DE CONTENIDO")
    print("="*70)
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*70)
    
    # Conectar a Supabase
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("✅ Conectado a Supabase\n")
    
    # Obtener artículos con poco contenido
    print(f"🔍 Buscando artículos con contenido corto...\n")
    
    result = supabase.table('articles').select('id, title, source_url, content, author').order('created_at', desc=True).limit(limit).execute()
    
    articles = result.data
    
    if not articles:
        print("⚠️  No se encontraron artículos")
        return
    
    print(f"📊 Encontrados: {len(articles)} artículos\n")
    
    updated_count = 0
    skipped_count = 0
    error_count = 0
    
    for i, article in enumerate(articles, 1):
        # Saltar si no tiene URL
        if not article.get('source_url'):
            continue
            
        print(f"[{i}/{len(articles)}] 📰 {article['title'][:60]}...")
        print(f"   📏 Contenido actual: {len(article['content'])} chars")
        
        # Si ya tiene buen contenido, omitir
        if len(article['content']) > 500:
            print(f"   ⏭️  Ya tiene buen contenido\n")
            skipped_count += 1
            continue
        
        # Extraer contenido completo
        full_content = extract_article_content(article['source_url'])
        
        if full_content and len(full_content) > len(article['content']):
            # Actualizar en Supabase
            try:
                supabase.table('articles').update({'content': full_content}).eq('id', article['id']).execute()
                
                print(f"   ✅ Actualizado: {len(article['content'])} → {len(full_content)} chars\n")
                updated_count += 1
                
            except Exception as e:
                print(f"   ❌ Error al actualizar: {str(e)}\n")
                error_count += 1
        else:
            print(f"   ⚠️  No se pudo mejorar\n")
            error_count += 1
        
        # Rate limiting
        time.sleep(1)
    
    # Resumen
    print("="*70)
    print("🎉 RESUMEN FINAL")
    print("="*70)
    print(f"✅ Actualizados: {updated_count}")
    print(f"⏭️  Omitidos: {skipped_count}")
    print(f"❌ Errores: {error_count}")
    print("="*70)

if __name__ == "__main__":
    # Procesar últimos 20 artículos
    enhance_articles(limit=20)
