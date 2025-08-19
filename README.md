# 📱 TodoApp - Organiza y Optimiza tus Tareas

Una aplicación web simple de gestión de tareas construida con Next.js 15, TypeScript, Firebase y shadcn/ui. Ofrece tanto autenticación con Google como modo demo local para máxima flexibilidad.

## ✨ Características Principales

- 🔐 **Autenticación Dual**
  - Login con Google usando Firebase Auth
  - Modo Demo Local (sin necesidad de cuenta)
  - Cambio fluido entre modos
- ✅ **Gestión Completa de Tareas**
  - Crear, editar, eliminar tareas
  - Marcar como completadas/pendientes
  - Descripciones detalladas
  - Fechas de vencimiento
- 🏷️ **Sistema de Prioridades**
  - Baja, Media, Alta con indicadores visuales
  - Colores diferenciados por prioridad
  - Ordenamiento por prioridad
- 📊 **Dashboard con Estadísticas**
  - Progreso visual con barras de progreso
  - Métricas en tiempo real
  - Contadores de tareas por estado
  - Distribución por prioridades
- 🔍 **Filtros Avanzados**
  - Ver todas las tareas
  - Solo pendientes
  - Solo completadas
  - Filtro por prioridad
- 📱 **Diseño Responsive**
  - Optimizado para móvil, tablet y desktop
  - Interface adaptativa
  - Touch-friendly en dispositivos móviles
- 🌙 **Temas Dinámicos**
  - Modo claro/oscuro
  - Detección automática de preferencias del sistema
  - Cambio manual con toggle
- ⚡ **Experiencia Fluida**
  - Animaciones suaves con Motion
  - Carga optimizada con loaders
  - Transiciones entre estados
- 🔄 **Sincronización Inteligente**
  - Tiempo real con Firestore (usuarios autenticados)
  - Persistencia local (modo demo)
  - Cambios instantáneos
- 👤 **Privacidad y Seguridad**
  - Tareas privadas por usuario
  - Reglas de seguridad en Firestore
  - Datos locales aislados por sesión

## 🛠️ Stack Tecnológico

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Runtime**: React 19 con TypeScript
- **Estilos**: Tailwind CSS + shadcn/ui
- **Iconos**: Lucide React
- **Animaciones**: Motion (Framer Motion v12)
- **Temas**: next-themes para modo claro/oscuro

### Backend & Base de Datos

- **Autenticación**: Firebase Auth (Google OAuth)
- **Base de Datos**: Firebase Firestore (tiempo real)
- **Almacenamiento Local**: localStorage (modo demo)
- **Reglas de Seguridad**: Firestore Security Rules

### Herramientas & DevEx

- **Build Tool**: Turbopack (desarrollo)
- **Linting**: ESLint + TypeScript
- **Gestión de Estado**: React Context API
- **Fechas**: date-fns + react-day-picker
- **Notificaciones**: Sonner (toast notifications)

## 🚀 Instalación y Configuración

### Prerrequisitos

```bash
# Versiones requeridas
Node.js >= 18.0.0
npm >= 8.0.0
```

### Configuración Inicial

```bash
# 1. Clonar el repositorio
git clone https://github.com/Z4kkDS/NextToDo.git
cd NextToDo/todo-app

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Firebase
```

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Firebase Configuration (Requerido para autenticación con Google)
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-xxxxxxxxxx # Opcional (Analytics)
```

> **Nota**: El modo demo local funciona sin configurar Firebase

### Ejecutar la Aplicación

```bash
# Desarrollo con Turbopack (recomendado)
npm run dev

# Desarrollo estándar
npm run dev --no-turbopack

# Construir para producción
npm run build

# Servir build de producción
npm run start

# Linting
npm run lint
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
todo-app/
├── 📁 app/                      # App Router de Next.js 15
│   ├── layout.tsx              # Layout principal con providers
│   ├── page.tsx                # Página principal (redireccionamiento)
│   ├── 📁 login/               # Página de autenticación
│   │   └── page.tsx           # Interfaz de login completa
│   └── 📁 dashboard/           # Dashboard principal
│       └── page.tsx           # Aplicación de tareas (protegida)
│
├── 📁 components/              # Componentes React organizados
│   ├── 📁 auth/               # Autenticación y usuario
│   │   ├── LoginForm.tsx      # Formulario de login (shadcn)
│   │   ├── UserHeader.tsx     # Header con info del usuario
│   │   └── index.ts          # Exportaciones centralizadas
│   │
│   ├── 📁 layouts/            # Componentes de layout
│   │   └── TodoLayout.tsx     # Layout específico para todos
│   │
│   ├── 📁 todo/               # Gestión de tareas
│   │   ├── CreateTodoDialog.tsx    # Dialog para crear tareas
│   │   ├── EditTodoDialog.tsx      # Dialog para editar tareas
│   │   ├── TodoFilter.tsx          # Filtros de tareas
│   │   ├── TodoInput.tsx           # Input de creación rápida
│   │   ├── TodoItem.tsx            # Item individual de tarea
│   │   ├── TodoItemAnimated.tsx    # Item con animaciones
│   │   ├── TodoList.tsx            # Lista principal de tareas
│   │   └── TodoStats.tsx           # Estadísticas y métricas
│   │
│   └── 📁 ui/                 # Componentes base de shadcn/ui
│       ├── button.tsx         # Botones reutilizables
│       ├── card.tsx           # Cards para contenido
│       ├── dialog.tsx         # Modales y dialogs
│       ├── input.tsx          # Inputs de formulario
│       ├── theme-toggle.tsx   # Toggle de tema claro/oscuro
│       └── ...                # Más componentes UI
│
├── 📁 context/                # Estado global con Context API
│   ├── AuthContext.tsx        # Autenticación (Google + Local)
│   └── TodoContext.tsx        # Gestión de tareas y sincronización
│
├── 📁 lib/                    # Servicios y utilidades
│   ├── firebase.ts           # Configuración de Firebase
│   ├── todoService.ts        # Servicio de tareas (Firestore)
│   ├── localTodoService.ts   # Servicio local (localStorage)
│   ├── priority-utils.ts     # Utilidades para prioridades
│   └── utils.ts              # Utilidades generales (cn, etc.)
│
├── 📁 types/                  # Definiciones TypeScript
│   └── index.ts              # Interfaces y tipos globales
│
├── 📁 public/                 # Archivos estáticos
│   └── ...                   # Iconos y assets
│
├── 🔥 Firebase Configuration  # Configuración de Firebase
│   ├── firestore.rules       # Reglas de seguridad
│   ├── firestore.indexes.json # Configuración de índices
│   ├── firebase.json         # Configuración del proyecto
│   └── .firebaserc           # Identificación del proyecto
│
└── 📄 Configuration Files     # Archivos de configuración
    ├── next.config.ts        # Configuración de Next.js
    ├── tailwind.config.js    # Configuración de Tailwind
    ├── tsconfig.json         # Configuración de TypeScript
    └── package.json          # Dependencias y scripts
```

│ ├── firebase.ts # Configuración de Firebase
│ ├── todoService.ts # Servicio de tareas con Firestore
│ └── utils.ts # Utilidades generales
├── types/ # Definiciones de TypeScript
├── firestore.rules # Reglas de seguridad de Firestore
├── firestore.indexes.json # Configuración de índices
├── firebase.json # Configuración de Firebase
└── .firebaserc # Identificación del proyecto

````

## 🔐 Seguridad

- **Autenticación requerida**: Solo usuarios autenticados pueden acceder
- **Reglas de Firestore**: Cada usuario solo puede ver/modificar sus tareas
- **Índices optimizados**: Consultas eficientes con índices compuestos
- **Variables de entorno**: Credenciales protegidas y no versionadas

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo con Turbopack
npm run build        # Construcción para producción
npm run start        # Servidor de producción
npm run lint         # Linting con ESLint
````

## 🧩 Componentes y Funcionalidades Clave

### 🔐 Sistema de Autenticación

- **AuthContext**: Gestión global de autenticación dual (Firebase + Local)
- **LoginForm**: Componente de formulario estilizado con shadcn/ui
- **UserHeader**: Header con avatar, nombre y opción de logout
- **Protección de rutas**: Redirección automática según estado de auth

### 📋 Gestión de Tareas

- **TodoContext**: Estado global de tareas con sincronización en tiempo real
- **TodoService**: Servicio para operaciones CRUD con Firestore
- **LocalTodoService**: Servicio para persistencia local con localStorage
- **TodoList**: Lista optimizada con virtual scrolling para grandes datasets
- **TodoItem**: Componente individual con animaciones y acciones rápidas

### 🎨 Interface y UX

- **TodoFilter**: Filtros avanzados con contadores en tiempo real
- **TodoStats**: Panel de estadísticas con gráficos y métricas
- **CreateTodoDialog**: Modal completo para creación de tareas
- **EditTodoDialog**: Edición in-place con validación
- **Theme Toggle**: Cambio fluido entre temas con persistencia

### ⚡ Optimizaciones de Rendimiento

- **Lazy loading**: Carga diferida de componentes pesados
- **Memoización**: React.memo en componentes críticos
- **Debouncing**: En filtros y búsquedas en tiempo real
- **Optimistic updates**: Actualizaciones inmediatas en UI

## 📊 Estructura de Datos

### Interfaz Principal de Tarea

```typescript
interface Todo {
  id: string; // Identificador único
  userId: string; // Firebase User UID o Local User ID
  text: string; // Título de la tarea
  description?: string; // Descripción opcional detallada
  completed: boolean; // Estado de completado
  priority: "baja" | "media" | "alta"; // Nivel de prioridad
  createdAt: Date; // Fecha de creación
  updatedAt: Date; // Fecha de última modificación
  dueDate?: Date; // Fecha de vencimiento opcional
}
```

### Tipos de Input

```typescript
// Para crear nuevas tareas
interface NewTodoInput {
  text: string;
  description?: string;
  priority: "baja" | "media" | "alta";
  dueDate?: Date;
}

// Para actualizar tareas existentes
interface UpdateTodoInput {
  text?: string;
  description?: string;
  priority?: "baja" | "media" | "alta";
  completed?: boolean;
  dueDate?: Date;
}
```

### Usuario Local vs Firebase

```typescript
// Usuario autenticado con Google
interface FirebaseUser extends User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

// Usuario en modo demo local
interface LocalUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  isLocal: boolean; // Identificador para modo local
}
```

## 🔥 Firebase Setup

Ver `FIREBASE_SETUP.md` para instrucciones detalladas de configuración de Firebase.

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en Vercel
3. Despliega automáticamente

### Firebase Hosting

```bash
npm run build
firebase deploy
```

## 🎯 Roadmap y Características Futuras

### ✅ Completado

- [x] Autenticación dual (Google + Local)
- [x] CRUD completo de tareas
- [x] Sistema de prioridades
- [x] Filtros avanzados
- [x] Sincronización en tiempo real
- [x] Tema claro/oscuro
- [x] Dashboard con estadísticas
- [x] Diseño responsive
- [x] Animaciones fluidas
- [x] Persistencia local
- [x] Reglas de seguridad

### 🚧 En Desarrollo

- [ ] **Búsqueda de tareas** - Motor de búsqueda full-text
- [ ] **Categorías y etiquetas** - Organización avanzada
- [ ] **Modo colaborativo** - Tareas compartidas entre usuarios
- [ ] **API REST** - Endpoints para integraciones

### 🔮 Planificado

- [ ] **Notificaciones push** - Recordatorios y alertas
- [ ] **Modo offline** - Sincronización cuando vuelva conexión
- [ ] **Exportar/Importar** - Respaldo de datos (JSON, CSV)
- [ ] **Temas personalizados** - Editor de colores y estilos
- [ ] **Aplicación móvil** - React Native o PWA
- [ ] **Integraciones** - Google Calendar, Notion, Slack
- [ ] **Analytics** - Métricas de productividad
- [ ] **Widgets** - Vista compacta para dashboard

### 💡 Ideas a Explorar

- [ ] **IA Asistente** - Sugerencias inteligentes de tareas
- [ ] **Gamificación** - Sistema de puntos y logros
- [ ] **Time tracking** - Medición de tiempo en tareas
- [ ] **Plantillas** - Templates predefinidos de tareas
- [ ] **Calendario integrado** - Vista de timeline y agenda

## 🌐 Despliegue en Producción

### Deploy en Vercel (Recomendado)

1. **Preparar el repositorio:**

   ```bash
   # Asegurar que todo esté committed
   git add .
   git commit -m "feat: ready for deployment"
   git push origin main
   ```

2. **Conectar con Vercel:**

   - Ve a [vercel.com](https://vercel.com) y conecta tu GitHub
   - Importa el repositorio `NextToDo`
   - Vercel detectará automáticamente que es un proyecto Next.js

3. **Configurar variables de entorno:**

   ```bash
   # En Vercel Dashboard → Tu Proyecto → Settings → Environment Variables
   NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-xxxxxxxxxx
   ```

4. **Configurar Firebase para producción:**

   ```bash
   # En Firebase Console → Authentication → Settings → Authorized domains
   # Agregar: tu-app.vercel.app
   ```

5. **Deploy automático:**
   - Vercel desplegará automáticamente en cada push a `main`
   - Build time: ~1-2 minutos
   - URL: `https://tu-app.vercel.app`

### Deploy en Firebase Hosting

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login en Firebase
firebase login

# Construir proyecto
npm run build

# Deploy a Firebase
firebase deploy --only hosting
```

### Deploy Manual/Otros Proveedores

```bash
# Construir para producción
npm run build

# Los archivos estáticos estarán en:
# ./out/ (si usas 'output: export')
# ./.next/ (para servidores Node.js)

# Servir con PM2 (servidores propios)
pm2 start npm --name "nextodo" -- start
```

### Variables de Entorno por Ambiente

```bash
# .env.local (desarrollo)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nextodo-dev

# .env.production (producción)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nextodo-prod
```

## 🤝 Contribuir al Proyecto

### Formas de Contribuir

- 🐛 **Reportar Bugs**: Crear issues detallados con pasos para reproducir
- ✨ **Sugerir Features**: Proponer nuevas funcionalidades
- 📝 **Mejorar Documentación**: Correcciones y ampliaciones al README
- 🔧 **Contribuir Código**: Pull requests con mejoras o nuevas features
- 🎨 **Diseño UX/UI**: Sugerencias de mejoras en la interfaz

### Proceso de Contribución

1. **Fork y Clone**

   ```bash
   # Fork el repositorio en GitHub
   git clone https://github.com/tu-usuario/NextToDo.git
   cd NextToDo/todo-app
   ```

2. **Configurar entorno**

   ```bash
   npm install
   cp .env.example .env.local
   # Configurar variables de entorno
   ```

3. **Crear rama de feature**

   ```bash
   git checkout -b feature/nombre-descriptivo
   # O para bugs: git checkout -b fix/descripcion-bug
   ```

4. **Desarrollar y testear**

   ```bash
   npm run dev  # Desarrollar
   npm run lint # Verificar linting
   npm run build # Verificar que build funciona
   ```

5. **Commit y Push**

   ```bash
   git add .
   git commit -m "feat: descripción clara del cambio"
   git push origin feature/nombre-descriptivo
   ```

6. **Crear Pull Request**
   - Título descriptivo
   - Descripción detallada de los cambios
   - Screenshots si hay cambios visuales
   - Referencia a issues relacionados

### Convenciones de Código

```typescript
// ✅ Buenas prácticas
const MyComponent = ({ prop1, prop2 }: Props) => {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  return (
    <div className="container mx-auto">
      {/* JSX content */}
    </div>
  );
};

// ✅ Naming conventions
- Componentes: PascalCase (UserHeader, TodoList)
- Variables/funciones: camelCase (handleSubmit, isLoading)
- Constantes: UPPER_SNAKE_CASE (API_ENDPOINTS)
- Archivos: kebab-case para utilidades, PascalCase para componentes
```

### Estructura de Commits

```bash
# Formato: tipo(scope): descripción

feat: agregar búsqueda de tareas
fix: corregir error en filtros
docs: actualizar README con nuevas features
style: mejorar estilos de botones
refactor: simplificar lógica de autenticación
test: agregar tests unitarios para TodoService
chore: actualizar dependencias
```

### Guidelines para Pull Requests

- **Una feature por PR**: Mantener cambios enfocados
- **Tests incluidos**: Si aplica, agregar tests para nuevas features
- **Documentación actualizada**: README, comentarios en código
- **Responsive design**: Verificar que funciona en mobile y desktop
- **Accesibilidad**: Seguir estándares WCAG donde sea posible

## � Licencia y Créditos

### Licencia

Este proyecto está bajo la licencia **MIT License**. Ver el archivo `LICENSE` para más detalles.

```
MIT License

Copyright (c) 2025 Z4kkDS

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

### Tecnologías y Librerías

- **[Next.js](https://nextjs.org/)** - Framework React para producción
- **[Firebase](https://firebase.google.com/)** - Backend as a Service
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes UI reutilizables
- **[Lucide React](https://lucide.dev/)** - Iconos SVG beautifuls
- **[Motion](https://motion.dev/)** - Animaciones para React
- **[Radix UI](https://www.radix-ui.com/)** - Primitivos UI accesibles

### Inspiración y Referencias

- **[Linear](https://linear.app/)** - Inspiración para UX/UI clean
- **[Notion](https://notion.so/)** - Ideas para gestión de tareas
- **[Vercel](https://vercel.com/)** - Mejores prácticas de Next.js

### Agradecimientos

- **Community de Next.js** por el excelente framework
- **Vercel** por el hosting gratuito y herramientas de desarrollo
- **shadcn** por los componentes UI de alta calidad
- **Firebase** por el backend robusto y fácil de usar

---

### 📞 Contacto y Soporte

- **GitHub**: [@Z4kkDS](https://github.com/Z4kkDS)
- **Issues**: [GitHub Issues](https://github.com/Z4kkDS/NextToDo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Z4kkDS/NextToDo/discussions)

### 🌟 ¿Te gustó el proyecto?

Si este proyecto te fue útil, considera:

- ⭐ Darle una estrella al repositorio
- 🐛 Reportar bugs o sugerir mejoras
- 🤝 Contribuir con código o documentación
- 📢 Compartirlo con otros desarrolladores

---

**Desarrollado con ❤️ usando Next.js, TypeScript y Github Copilot**

## 🆘 Troubleshooting y Preguntas Frecuentes

### Problemas de Instalación

**Error: "Module not found"**

```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install
```

**Error: "Next.js version compatibility"**

```bash
# Verificar versiones compatibles
npm ls next react react-dom
npm update
```

### Problemas de Firebase

**Error: "The query requires an index"**

```bash
# El índice se crea automáticamente desde Firebase Console
# O usa: firebase deploy --only firestore:indexes
```

**Error: "Firebase configuration is invalid"**

```bash
# Verificar variables de entorno
echo $NEXT_PUBLIC_FIREBASE_API_KEY
# Revisar que todas las variables estén definidas en .env.local
```

**Error: "Google sign-in popup blocked"**

- Verificar que el popup no esté bloqueado por el navegador
- Autorizar el dominio en Firebase Console → Authentication → Settings

### Problemas de Autenticación

**Error: "Unauthorized domain"**

```bash
# En Firebase Console → Authentication → Settings → Authorized domains
# Agregar: localhost, 127.0.0.1, tu-dominio-production.com
```

**Usuario local no persiste**

```bash
# Verificar localStorage en DevTools → Application → Storage
# Limpiar storage si es necesario: localStorage.clear()
```

### Problemas de Permisos en Firestore

**Error: "Missing or insufficient permissions"**

```bash
# Verificar reglas en firestore.rules
# Asegurar que el usuario esté autenticado
# Verificar que userId coincida con auth.uid
```

### Problemas de Rendimiento

**App carga lentamente**

```bash
# Verificar build de producción
npm run build
npm run start

# Revisar Network tab en DevTools
# Considerar implementar lazy loading
```

**Memoria alta en desarrollo**

```bash
# Usar Turbopack para desarrollo más rápido
npm run dev --turbopack

# O aumentar memoria para Node.js
NODE_OPTIONS="--max-old-space-size=4096" npm run dev
```

### Scripts de Debugging

```bash
# Verificar configuración de Firebase
npm run firebase:check

# Limpiar builds y cache
npm run clean

# Análisis del bundle
npm run build:analyze
```

### Logs y Monitoreo

```bash
# Logs en desarrollo
console.log() automáticamente aparecen en browser console

# Logs en producción (Vercel)
# Ver en Vercel Dashboard → Tu Proyecto → Functions → Logs

# Monitoreo de errores
# Integrar Sentry o similar para error tracking
```
