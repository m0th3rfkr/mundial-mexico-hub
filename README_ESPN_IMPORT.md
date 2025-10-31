# 🏆 Importador ESPN RSS → Supabase

Script automatizado para importar noticias deportivas desde ESPN RSS feeds a la tabla `articles` en Supabase.

---

## 🎯 ¿Qué hace este script?

1. ✅ Lee noticias desde múltiples RSS feeds de ESPN
2. ✅ Limpia y formatea el contenido (HTML → texto limpio)
3. ✅ Extrae imágenes, categorías y tags automáticamente
4. ✅ Evita duplicados (revisa por slug)
5. ✅ Inserta artículos directamente en tu base de datos Supabase

---

## 📋 Requisitos Previos

- **Python 3.7+** instalado
- **Cuenta de Supabase** con el proyecto configurado
- **Service Role Key** de Supabase

---

## 🚀 Instalación Rápida

### Paso 1: Instalar dependencias

```bash
pip3 install -r requirements.txt
```

O instalar manualmente:

```bash
pip3 install supabase feedparser requests python-slugify
```

---

## 🔑 Configuración

### Obtener tu Service Role Key:

1. Ve a: https://supabase.com/dashboard/project/ksiiidnvtktlowlhtebs/settings/api
2. Copia la **`service_role`** key (⚠️ NO la `anon` key)

### Configurar la variable de entorno:

**En Mac/Linux:**
```bash
export SUPABASE_KEY='tu_service_role_key_aqui'
```

**En Windows (CMD):**
```cmd
set SUPABASE_KEY=tu_service_role_key_aqui
```

**En Windows (PowerShell):**
```powershell
$env:SUPABASE_KEY="tu_service_role_key_aqui"
```

---

## ▶️ Ejecución

```bash
python3 import_espn_rss.py
```

---

## 📊 Ejemplo de Salida

```
============================================================
🏆 IMPORTADOR ESPN RSS → SUPABASE
============================================================
✅ Conectado a Supabase

============================================================
📡 Importando desde: ESPN Deportes - General
🔗 URL: https://www.espn.com/espn/rss/news
============================================================

📰 Encontradas 25 noticias

✅ Importado: NFL Week 10 Preview: Top matchups and predictions...
✅ Importado: NBA: Lakers defeat Warriors in overtime thriller...
⏭️  Ya existe: Champions League: Real Madrid advances to finals...
✅ Importado: MLB: Yankees sign star pitcher to record deal...

============================================================
📊 RESUMEN FINAL
============================================================
📰 Total de noticias procesadas: 75
✅ Importadas exitosamente: 42
⏭️  Saltadas (ya existían): 28
❌ Errores: 5
============================================================

🎉 ¡Importación completada exitosamente!

💡 Puedes ver las noticias en:
   https://lovable.dev/projects/130d2522-f5c7-46cf-8735-0f3265474abc
```

---

## ⚙️ Configuración Avanzada

### Cambiar los feeds RSS:

Edita el array `ESPN_RSS_FEEDS` en `import_espn_rss.py`:

```python
ESPN_RSS_FEEDS = [
    {
        "name": "ESPN Soccer",
        "url": "https://www.espn.com/espn/rss/soccer/news",
        "category": "Fútbol"
    },
    # Agregar más feeds aquí
]
```

### URLs de RSS disponibles de ESPN:

- **General**: `https://www.espn.com/espn/rss/news`
- **Soccer/Fútbol**: `https://www.espn.com/espn/rss/soccer/news`
- **NFL**: `https://www.espn.com/espn/rss/nfl/news`
- **NBA**: `https://www.espn.com/espn/rss/nba/news`
- **MLB**: `https://www.espn.com/espn/rss/mlb/news`
- **Boxing**: `https://www.espn.com/espn/rss/boxing/news`

---

## 🔄 Automatización

### Ejecutar cada hora (cron job en Mac/Linux):

```bash
# Abrir crontab
crontab -e

# Agregar línea (ejecuta cada hora)
0 * * * * cd /ruta/a/tu/script && /usr/local/bin/python3 import_espn_rss.py >> importador.log 2>&1
```

### Ejecutar diariamente a las 8 AM:

```bash
0 8 * * * cd /ruta/a/tu/script && /usr/local/bin/python3 import_espn_rss.py >> importador.log 2>&1
```

---

## 🛠️ Troubleshooting

### Error: "SUPABASE_KEY no configurada"

**Solución**: Configura la variable de entorno como se indica arriba.

### Error: "No module named 'supabase'"

**Solución**: Instala las dependencias:
```bash
pip3 install -r requirements.txt
```

### Error: "Max retries exceeded" o timeouts

**Solución**: Problema de conexión a internet. Verifica tu red y vuelve a intentar.

### Error: "duplicate key value violates unique constraint"

**Solución**: El artículo ya existe (por slug). El script ya maneja esto automáticamente.

---

## 📁 Estructura de Artículos Importados

Los artículos se guardan en la tabla `articles` con esta estructura:

```typescript
{
  title: string           // Título de la noticia
  slug: string            // URL-friendly slug (único)
  content: string         // Contenido limpio (sin HTML)
  excerpt: string         // Resumen corto (~200 chars)
  cover_image_url: string // URL de imagen principal (si existe)
  author: "ESPN"          // Siempre ESPN
  category: string        // Fútbol, NBA, NFL, etc.
  tags: string[]          // ["ESPN", "Mundial 2026", "México", etc.]
  published_at: timestamp // Fecha de publicación
  is_featured: false      // Por defecto no destacado
  views: 0                // Contador de vistas
}
```

---

## 🎨 Personalización

### Cambiar el autor:

Busca en `import_espn_rss.py`:

```python
"author": "ESPN"  # Cambiar a tu preferencia
```

### Marcar artículos como destacados:

```python
"is_featured": True  # Cambiar de False a True
```

### Modificar excerpt length:

```python
excerpt = extract_excerpt(content, max_length=300)  # Por defecto 200
```

---

## 📞 Soporte

**Proyecto**: Mundial México Hub  
**Supabase**: https://supabase.com/dashboard/project/ksiiidnvtktlowlhtebs  
**Lovable**: https://lovable.dev/projects/130d2522-f5c7-46cf-8735-0f3265474abc

---

## 📝 Licencia

Script creado para el proyecto Mundial México Hub 2026.

---

## ✅ Checklist de Uso

- [ ] Python 3.7+ instalado
- [ ] Dependencias instaladas (`pip3 install -r requirements.txt`)
- [ ] Service Role Key obtenida de Supabase
- [ ] Variable `SUPABASE_KEY` configurada
- [ ] Script ejecutado exitosamente
- [ ] Noticias visibles en Supabase
- [ ] (Opcional) Cron job configurado para automatización

---

¡Listo! 🎉 Tu importador de noticias ESPN está configurado y funcionando.
