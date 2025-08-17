# 📱 TodoApp - Organiza y Optimiza tus Tareas

Una aplicación moderna de gestión de tareas construida con Next.js 15, TypeScript, Firebase y shadcn/ui.

## ✨ Características

- 🔐 **Autenticación segura** - Login con Google usando Firebase Auth
- ✅ **Gestión completa de tareas** - Crear, editar, marcar como completadas
- 🏷️ **Prioridades** - Baja, Media, Alta con indicadores visuales
- 📊 **Estadísticas** - Progreso visual y métricas en tiempo real
- 🔍 **Filtros** - Ver todas, pendientes o completadas
- 📱 **Responsive** - Optimizado para móvil y desktop
- 🌙 **Tema oscuro/claro** - Modo automático basado en preferencias del sistema
- ⚡ **Animaciones fluidas** - Transiciones suaves con Framer Motion
- 🔄 **Sincronización en tiempo real** - Cambios instantáneos con Firestore
- 👤 **Tareas privadas** - Cada usuario solo ve sus propias tareas
- ☁️ **Persistencia en la nube** - Datos seguros en Firebase Firestore

## 🛠️ Tecnologías

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Firebase (Authentication + Firestore)
- **Styling**: Tailwind CSS, shadcn/ui
- **Animaciones**: Framer Motion
- **Iconos**: Lucide React
- **Estado**: React Context API
- **Base de datos**: Firebase Firestore
- **Autenticación**: Firebase Auth (Google OAuth)

## 🚀 Instalación y Uso

### Prerrequisitos

1. Node.js 18+ instalado
2. Una cuenta de Firebase
3. Proyecto de Firebase configurado

### Configuración

```bash
# Clonar el repositorio
git clone <repository-url>
cd TodoApp

# Navegar al proyecto
cd todo-app

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Firebase
```

### Variables de entorno requeridas

Crea un archivo `.env.local` con:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

### Ejecutar la aplicación

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm run start
```

## 📁 Estructura del Proyecto

```
todo-app/
├── app/                      # App Router de Next.js
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Página principal (protegida)
│   └── login/               # Página de autenticación
├── components/
│   ├── auth/                # Componentes de autenticación
│   ├── layouts/             # Componentes de layout
│   ├── todo/                # Componentes específicos de tareas
│   └── ui/                  # Componentes UI de shadcn
├── context/                 # Context API para estado global
│   ├── AuthContext.tsx      # Manejo de autenticación
│   └── TodoContext.tsx      # Manejo de tareas
├── lib/                     # Utilidades y servicios
│   ├── firebase.ts          # Configuración de Firebase
│   ├── todoService.ts       # Servicio de tareas con Firestore
│   └── utils.ts             # Utilidades generales
├── types/                   # Definiciones de TypeScript
├── firestore.rules          # Reglas de seguridad de Firestore
├── firestore.indexes.json   # Configuración de índices
├── firebase.json            # Configuración de Firebase
└── .firebaserc              # Identificación del proyecto
```

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
```

## 🧩 Componentes Principales

- **AuthContext**: Manejo global del estado de autenticación
- **TodoContext**: Gestión de tareas con sincronización en tiempo real
- **TodoService**: Servicio para operaciones CRUD con Firestore
- **LoginPage**: Interfaz de autenticación con Google
- **UserHeader**: Header con información del usuario y logout
- **TodoList**: Lista de tareas con filtros y animaciones

## 📊 Estructura de Datos

Cada tarea se almacena en Firestore con la siguiente estructura:

```typescript
interface Todo {
  id: string;
  userId: string; // Firebase User UID
  text: string;
  description?: string;
  completed: boolean;
  priority: "baja" | "media" | "alta";
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
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

## 🎯 Roadmap

- [x] Autenticación con Firebase Auth
- [x] Persistencia con Firestore
- [x] Sincronización en tiempo real
- [x] Seguridad por usuario
- [ ] Búsqueda de tareas
- [ ] Categorías y etiquetas
- [ ] Recordatorios push
- [ ] Tema personalizable
- [ ] Exportar/Importar tareas
- [ ] Colaboración en tareas

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

MIT License - ver archivo LICENSE para más detalles.

## 🆘 Troubleshooting

### Error: "The query requires an index"

- El índice compuesto se crea automáticamente desde la consola de Firebase
- O usa: `firebase deploy --only firestore:indexes`

### Error de autenticación

- Verifica que las variables de entorno estén configuradas correctamente
- Asegúrate de que el dominio esté autorizado en Firebase Auth

### Problemas de permisos en Firestore

- Revisa las reglas en `firestore.rules`
- Verifica que el usuario esté autenticado
