# 🤖 CONFIGURACIÓN AUTOMÁTICA - RSS IMPORTER

## ⏰ EJECUTAR CADA HORA AUTOMÁTICAMENTE

Para que siempre tengas noticias frescas, configura esto:

### PASO 1: Abrir crontab
```bash
crontab -e
```

### PASO 2: Agregar esta línea al final
```bash
0 * * * * /Users/tonym/Code/mundial-mexico-hub/scripts/run_importer.sh
```

Esto ejecutará el importador **cada hora en punto** (10:00, 11:00, 12:00, etc.)

### PASO 3: Guardar y salir
- Si usa vim: Presiona `ESC`, luego escribe `:wq` y Enter
- Si usa nano: Presiona `Ctrl+X`, luego `Y`, luego Enter

---

## 📊 VER EL LOG

Para ver qué ha importado:
```bash
tail -f /tmp/rss_import.log
```

---

## ✅ VERIFICAR QUE ESTÉ FUNCIONANDO

Después de configurar, espera 1 hora y revisa:
```bash
cat /tmp/rss_import.log
```

---

## 🎯 LÍMITES CONFIGURADOS

- **Máximo por fuente:** 200 noticias
- **Fuentes activas:** 3 (90min, BBC Sport, Sky Sports)
- **Frecuencia:** Cada hora
- **Evita duplicados:** Automáticamente

---

## 🔧 ALTERNATIVAS DE FRECUENCIA

Si quieres cambiar la frecuencia:

**Cada 2 horas:**
```bash
0 */2 * * * /Users/tonym/Code/mundial-mexico-hub/scripts/run_importer.sh
```

**Cada 30 minutos:**
```bash
*/30 * * * * /Users/tonym/Code/mundial-mexico-hub/scripts/run_importer.sh
```

**Solo de 8am a 10pm cada hora:**
```bash
0 8-22 * * * /Users/tonym/Code/mundial-mexico-hub/scripts/run_importer.sh
```

---

¡Ya está listo para noticias automáticas 24/7! 🚀
