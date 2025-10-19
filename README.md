# WC2025 - Guía Mundial de Fútbol 2026

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-in%20development-yellow)](https://github.com/m0th3rfkr/mundial-mexico-hub)
[![Lovable](https://img.shields.io/badge/Built%20with-Lovable-ff69b4)](https://lovable.dev)

> Aplicación móvil y web completa para el Mundial de Fútbol 2026 - Desarrollo para Cocolab

---

## 📱 Descripción

WC2025 es una aplicación completa para el Mundial de Fútbol 2026 que proporciona:
- 📊 Información en tiempo real de partidos
- 📈 Estadísticas avanzadas de equipos y jugadores
- ✍️ Contenido editorial exclusivo
- 🎮 Gamificación y quinielas
- 🔔 Notificaciones push para eventos importantes
- 🌐 Disponible en Web, iOS y Android

---

## 🛠 Stack Tecnológico

### Frontend
- **Web App**: [Lovable](https://lovable.dev) (React + TypeScript + Vite)
- **Mobile App**: Capacitor → iOS/Android (mismo código base)
- **UI Components**: shadcn-ui + Tailwind CSS
- **Admin Panel**: Streamlit (MVP) → Next.js (producción)

### Backend
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Auth**: Supabase Auth
- **Real-time**: Supabase Realtime

### Integraciones
- **Project Management**: Linear
- **Content Management**: Airtable
- **Version Control**: GitHub
- **Automation**: n8n
- **Documentation**: Notion

---

## 🏗 Arquitectura
```
┌─────────────────────────────────┐
│     Lovable Web App (React)     │
│    https://lovable.dev/...      │
└────────────┬────────────────────┘
             │
             ├──→ PWA (Progressive Web App)
             │
             └──→ Capacitor
                     ├──→ 📱 App Store (iOS)
                     └──→ 🤖 Google Play (Android)
             
             ↓ (conecta con)
             
┌─────────────────────────────────┐
│       Supabase Backend          │
│   PostgreSQL + Storage + Auth   │
└────────────┬────────────────────┘
             │
             ├──→ Admin Panel (Streamlit/Next.js)
             │
             └──→ Airtable (Content Management)
                      ↕
                  n8n (Automation)
```

---

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+ y npm ([instalar con nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [Lovable](https://lovable.dev) (opcional, para desarrollo visual)

### Instalación
```bash
# 1. Clonar el repositorio
git clone https://github.com/m0th3rfkr/mundial-mexico-hub.git
cd mundial-mexico-hub

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales (ver sección Configuración)

# 4. Iniciar servidor de desarrollo
npm run dev
```

El proyecto estará disponible en `http://localhost:5173`

---

## ⚙️ Configuración

### Variables de Entorno

Copia `.env.example` a `.env` y configura las siguientes variables:
```bash
# Supabase (requerido)
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key

# Airtable (opcional - solo para admin panel)
AIRTABLE_API_KEY=tu_api_key
AIRTABLE_BASE_ID=tu_base_id

# Linear (opcional - solo para gestión de proyecto)
LINEAR_API_KEY=tu_linear_key

# n8n (opcional - solo para automatizaciones)
N8N_WEBHOOK_URL=tu_webhook_url
```

Ver [docs/SETUP.md](docs/SETUP.md) para instrucciones detalladas.

---

## 📱 Desarrollo Mobile (Capacitor)
```bash
# Instalar dependencias de Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios @capacitor/android

# Inicializar proyecto Capacitor
npx cap init wc2025 com.cocolab.wc2025

# Agregar plataformas
npx cap add ios
npx cap add android

# Build y sincronización
npm run build
npx cap sync

# Abrir en Xcode (iOS) o Android Studio
npx cap open ios
npx cap open android
```

---

## 🎨 Desarrollo con Lovable

Este proyecto se puede editar de **3 formas**:

### 1. **Lovable Cloud IDE** (Recomendado para diseño UI)
- Visita: https://lovable.dev/projects/130d2522-f5c7-46cf-8735-0f3265474abc
- Usa prompts en lenguaje natural para crear componentes
- Los cambios se commitean automáticamente a este repo

### 2. **IDE Local** (VSCode, WebStorm, etc.)
```bash
npm run dev
```
- Edita archivos localmente
- Haz push a GitHub
- Los cambios se reflejan automáticamente en Lovable

### 3. **GitHub Codespaces**
- Click en "Code" → "Codespaces" → "New codespace"
- Edita directamente en el navegador

---

## 📋 Features por Fase

### ✅ Fase 0: Setup (Completado)
- [x] Setup de Lovable + Supabase
- [x] Configuración de variables de entorno
- [x] Integración con Airtable, Linear, n8n
- [x] Estructura base del proyecto

### 🚧 Fase 1: MVP (Oct-Dic 2025)
- [ ] Sistema de autenticación de usuarios
- [ ] Catálogo completo de equipos (48 selecciones)
- [ ] Base de datos de jugadores
- [ ] Calendario de partidos interactivo
- [ ] Página de detalles de cada partido
- [ ] Contenido editorial básico (noticias/artículos)
- [ ] Sistema de notificaciones

### 🔮 Fase 2: Apps Nativas (Ene-Feb 2026)
- [ ] Build de apps con Capacitor
- [ ] Notificaciones push nativas
- [ ] Modo offline
- [ ] Estadísticas en tiempo real
- [ ] Sistema de quinielas/predicciones
- [ ] Gamificación (puntos, badges, rankings)
- [ ] Share social integrado

### 🚀 Fase 3: Launch (Marzo 2026)
- [ ] Testing QA completo
- [ ] Beta testing con usuarios
- [ ] Optimización de performance
- [ ] Publicación en App Store
- [ ] Publicación en Google Play
- [ ] Campaña de marketing

---

## 📂 Estructura del Proyecto
```
mundial-mexico-hub/
├── src/
│   ├── components/       # Componentes React reutilizables
│   ├── pages/           # Páginas de la aplicación
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilidades y configuración
│   ├── integrations/    # Integraciones (Supabase, etc.)
│   └── types/           # TypeScript types
├── public/              # Archivos estáticos
├── docs/                # Documentación
│   ├── ARCHITECTURE.md  # Arquitectura del sistema
│   └── SETUP.md         # Guía de instalación detallada
├── .env.example         # Template de variables de entorno
├── capacitor.config.ts  # Configuración de Capacitor
└── package.json         # Dependencias del proyecto
```

---

## 🧪 Scripts Disponibles
```bash
# Desarrollo
npm run dev              # Servidor de desarrollo con hot-reload

# Build
npm run build            # Build para producción
npm run preview          # Preview del build de producción

# Capacitor
npm run cap:sync         # Sincronizar web → native
npm run cap:ios          # Abrir proyecto iOS
npm run cap:android      # Abrir proyecto Android

# Calidad de código
npm run lint             # Linter (ESLint)
npm run type-check       # Verificar tipos TypeScript
```

---

## 🌐 Deploy

### Web (PWA)
```bash
# Desde Lovable
1. Ir a Share → Publish
2. Tu app estará en: https://wc2025.lovable.app

# Deploy personalizado (opcional)
npm run build
# Deploy a Vercel, Netlify, etc.
```

### Mobile (iOS/Android)
Ver [docs/SETUP.md](docs/SETUP.md#mobile-deployment) para instrucciones de publicación en tiendas.

---

## 🔗 Custom Domain

Para conectar un dominio personalizado:
1. Ve a Project > Settings > Domains en Lovable
2. Click en "Connect Domain"
3. Sigue las instrucciones

Documentación: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain)

---

## 👥 Team

- **Product Owner / Dev Jr**: Toño M. ([@m0th3rfkr](https://github.com/m0th3rfkr))
- **Head Developer**: Samuel Pozaicer
- **Director**: Alejandro Machorro
- **Cliente**: Televisa / Cocolab

---

## 📅 Roadmap

| Periodo | Fase | Objetivos |
|---------|------|-----------|
| **Q4 2025** | Setup + MVP | Base funcional con equipos, partidos y contenido |
| **Q1 2026** | Apps Nativas | Build mobile + Gamificación |
| **Marzo 2026** | Launch | 🚀 Lanzamiento oficial |

---

## 📄 License

Apache 2.0 - ver [LICENSE](LICENSE)

Este proyecto usa CC0 1.0 para ciertos componentes - ver archivo LICENSE para detalles.

---

## 🔗 Enlaces Útiles

- **Lovable Project**: https://lovable.dev/projects/130d2522-f5c7-46cf-8735-0f3265474abc
- **Supabase Dashboard**: https://supabase.com/dashboard/project/ksiiidnvtktlowlhtebs
- **Airtable Base**: https://airtable.com/app4HYUcHjyjF7RYI
- **Linear Board**: [Tu workspace de Linear]
- **Notion Docs**: [Tu workspace de Notion]

---

## 💡 ¿Necesitas ayuda?

- 📖 Documentación completa: [docs/](docs/)
- 🐛 Reportar bug: [GitHub Issues](https://github.com/m0th3rfkr/mundial-mexico-hub/issues)
- 💬 Discusiones: [GitHub Discussions](https://github.com/m0th3rfkr/mundial-mexico-hub/discussions)

---

**Status:** 🚧 En desarrollo activo  
**Stack:** Lovable + Capacitor + Supabase + Airtable  
**Target Launch:** Marzo 2026  
**Last Updated:** Octubre 2025
