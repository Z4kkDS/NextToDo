# 📱 TodoApp - Organiza y Optimiza tus Tareas

Una aplicación moderna de gestión de tareas construida con Next.js 15, TypeScript y shadcn/ui.

## ✨ Características

- ✅ **Gestión completa de tareas** - Crear, editar, marcar como completadas
- 🏷️ **Prioridades** - Baja, Media, Alta con indicadores visuales
- 📊 **Estadísticas** - Progreso visual y métricas en tiempo real
- 🔍 **Filtros** - Ver todas, pendientes o completadas
- 📱 **Responsive** - Optimizado para móvil y desktop
- 🌙 **Tema oscuro/claro** - Modo automático basado en preferencias del sistema
- ⚡ **Animaciones fluidas** - Transiciones suaves con Framer Motion
- 🔄 **Paginación** - Organización eficiente de tareas (5 por página)

## 🛠️ Tecnologías

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Animaciones**: Framer Motion
- **Iconos**: Lucide React
- **Estado**: React Context API
- **Persistencia**: LocalStorage

## 🚀 Instalación y Uso

```bash
# Clonar el repositorio
git clone <repository-url>
cd TodoApp

# Navegar al proyecto
cd todo-app

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## 📁 Estructura del Proyecto

```
todo-app/
├── app/                    # App Router de Next.js
├── components/            
│   ├── layouts/           # Componentes de layout
│   ├── todo/              # Componentes específicos de tareas
│   └── ui/                # Componentes UI de shadcn
├── context/               # Context API para estado global
├── lib/                   # Utilidades y helpers
├── types/                 # Definiciones de TypeScript
└── public/                # Archivos estáticos
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Construcción
npm run start        # Producción
npm run lint         # Linting
```

## 🎯 Roadmap

- [ ] Layout híbrido mejorado para desktop
- [ ] Búsqueda de tareas
- [ ] Categorías y etiquetas
- [ ] Recordatorios y fechas de vencimiento
- [ ] Sincronización en la nube
- [ ] Exportar/Importar tareas

## 📝 Licencia

MIT License - ver archivo LICENSE para más detalles.
