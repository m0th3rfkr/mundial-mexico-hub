# 📋 BITÁCORA - Sesión 6 de Noviembre 2025

## ✅ LO QUE SE LOGRÓ HOY:

### 🗺️ **12 Edge Functions de KML Funcionando:**

#### **5 Categorías Generales:**
1. ✅ Restaurantes: `https://ksiiidnvtktlowlhtebs.supabase.co/functions/v1/goodbarber-restaurantes-kml`
2. ✅ Hoteles: `https://ksiiidnvtktlowlhtebs.supabase.co/functions/v1/goodbarber-hoteles-kml`
3. ✅ Imperdibles: `https://ksiiidnvtktlowlhtebs.supabase.co/functions/v1/goodbarber-imperdibles-kml`
4. ✅ Estacionamientos: `https://ksiiidnvtktlowlhtebs.supabase.co/functions/v1/goodbarber-estacionamientos-kml`
5. ✅ EcoBici: `https://ksiiidnvtktlowlhtebs.supabase.co/functions/v1/goodbarber-ecobici-kml`

#### **7 Corredores Turísticos (todas las categorías mezcladas):**
1. ✅ Zona Rosa: `https://ksiiidnvtktlowlhtebs.supabase.co/functions/v1/goodbarber-zona-rosa-kml`
2. ✅ Basílica: `https://ksiiidnvtktlowlhtebs.supabase.co/functions/v1/goodbarber-basilica-kml`
3. ✅ Coyoacán: `https://ksiiidnvtktlowlhtebs.supabase.co/functions/v1/goodbarber-coyoacan-kml`
4. ✅ Garibaldi: `https://ksiiidnvtktlowlhtebs.supabase.co/functions/v1/goodbarber-garibaldi-kml`
5. ✅ Xochimilco: `https://ksiiidnvtktlowlhtebs.supabase.co/functions/v1/goodbarber-xochimilco-kml`
6. ✅ Centro Histórico: `https://ksiiidnvtktlowlhtebs.supabase.co/functions/v1/goodbarber-centro-historico-kml`
7. ✅ Chapultepec: `https://ksiiidnvtktlowlhtebs.supabase.co/functions/v1/goodbarber-chapultepec-kml`

---

## 🚧 LO QUE FALTA POR HACER:

### **35 Funciones Filtradas (7 corredores × 5 categorías):**

Se decidió crear URLs específicas para cada combinación de corredor + categoría para tener mejor UX en GoodBarber.

**Ejemplo de URLs a crear:**
- `/goodbarber-zona-rosa-restaurantes-kml`
- `/goodbarber-zona-rosa-hoteles-kml`
- `/goodbarber-zona-rosa-imperdibles-kml`
- `/goodbarber-zona-rosa-estacionamientos-kml`
- `/goodbarber-zona-rosa-ecobici-kml`

(Y lo mismo para los otros 6 corredores)

**Estado actual:**
- ✅ 2/35 creadas (Zona Rosa: restaurantes y hoteles)
- 🚧 33/35 pendientes

---

## 📊 INFORMACIÓN TÉCNICA:

### **IDs de Corredores:**
```json
{
  "zona-rosa": "8aad43fc-9854-40d3-a73b-2558f42d14ad",
  "basilica": "b1663b4b-466f-433f-9f8a-9ea2508ad032",
  "coyoacan": "97493529-0625-44c7-a514-0b41cf612903",
  "garibaldi": "762ff70a-2f15-4422-82ad-96d271b09bd2",
  "xochimilco": "bc2c91a3-b564-4962-b74d-e13b6b7cb1b3",
  "centro-historico": "1a607716-bad4-4982-ba13-99884c02a730",
  "chapultepec": "b90c50e9-027e-4394-ac13-57f29d4bc84f"
}
```

### **Configuración de Categorías:**
```json
{
  "restaurantes": {
    "tabla": "restaurantes",
    "icon": "🍽️",
    "nombre": "Restaurante",
    "campo_activo": "activo"
  },
  "hoteles": {
    "tabla": "hoteles",
    "icon": "🏨",
    "nombre": "Hotel",
    "campo_activo": "activo"
  },
  "imperdibles": {
    "tabla": "imperdibles_turisticos",
    "icon": "🎯",
    "nombre": "Imperdible",
    "campo_activo": "activo"
  },
  "estacionamientos": {
    "tabla": "estacionamientos",
    "icon": "🅿️",
    "nombre": "Estacionamiento",
    "campo_activo": "activo"
  },
  "ecobici": {
    "tabla": "estaciones_ecobici",
    "icon": "🚲",
    "nombre": "EcoBici",
    "campo_activo": "activa"
  }
}
```

---

## 🎨 PALETA DE COLORES (GoodBarber):
- **Primary/Fondo:** #962044 (Vino/Guinda)
- **Negro:** #0A0A0A
- **Gris oscuro:** #323232
- **Gris claro:** #DEDEDE
- **Blanco/Texto:** #FDFDFD

---

## 📱 ESTRUCTURA EN GOODBARBER:

### **Nivel 1: Menú "7 Rutas de CDMX"**
- Custom List con Grid Layout
- 7 items con imágenes de fondo
- Cada item abre su sub-menú

### **Nivel 2: Sub-menú por Corredor**
Cada corredor tendrá 6 opciones:
1. 🗺️ **Ver Todo** (URL del corredor completo)
2. 🍽️ **Restaurantes** (URL filtrada)
3. 🏨 **Hoteles** (URL filtrada)
4. 🎯 **Imperdibles** (URL filtrada)
5. 🅿️ **Estacionamientos** (URL filtrada)
6. 🚲 **EcoBici** (URL filtrada)

---

## 🔑 COMANDOS IMPORTANTES:

### **Deploy una función:**
```bash
cd ~/Code/mundial-mexico-hub
supabase functions deploy goodbarber-NOMBRE-kml --no-verify-jwt
```

### **Deploy múltiples funciones:**
```bash
for func in zona-rosa basilica coyoacan garibaldi xochimilco centro-historico chapultepec; do
  supabase functions deploy goodbarber-${func}-kml --no-verify-jwt
done
```

### **Ver funciones deployadas:**
```bash
supabase functions list
```

---

## 📂 ESTRUCTURA DE ARCHIVOS:
```
supabase/functions/
├── goodbarber-restaurantes-kml/
├── goodbarber-hoteles-kml/
├── goodbarber-imperdibles-kml/
├── goodbarber-estacionamientos-kml/
├── goodbarber-ecobici-kml/
├── goodbarber-zona-rosa-kml/
├── goodbarber-basilica-kml/
├── goodbarber-coyoacan-kml/
├── goodbarber-garibaldi-kml/
├── goodbarber-xochimilco-kml/
├── goodbarber-centro-historico-kml/
├── goodbarber-chapultepec-kml/
├── goodbarber-zona-rosa-restaurantes-kml/ ✅
├── goodbarber-zona-rosa-hoteles-kml/ ✅
└── [33 funciones más por crear]
```

---

## 🎯 PRÓXIMOS PASOS (PARA EL SIGUIENTE CHAT):

1. ✅ Crear las 33 funciones filtradas restantes
2. ✅ Deploy de todas las funciones
3. ✅ Probar que todas las URLs funcionen
4. ✅ Documentar las 47 URLs finales
5. ✅ Configurar en GoodBarber la estructura de navegación
6. ✅ Añadir imágenes de fondo a las 7 rutas

---

## 💡 NOTAS TÉCNICAS:

- Todas las funciones usan `--no-verify-jwt` para ser públicas
- Las variables de entorno (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) se inyectan automáticamente
- Los KML incluyen imágenes, descripciones y coordenadas
- Filtros: `eq('corredor_id', ID)`, `eq('activo', true)`, `neq('latitud', 0)`

---

## 🐛 PROBLEMAS ENCONTRADOS Y SOLUCIONADOS:

1. **Nombres de tablas incorrectos:** Se asumió "ecobici" pero era "estaciones_ecobici"
2. **Campo activo diferente:** EcoBici usa "activa" en vez de "activo"
3. **Scripts bash fallaron:** Se usó approach manual con heredoc
4. **Python template error:** Se decidió crear funciones manualmente

---

Última actualización: 6 de Noviembre 2025, 17:30
