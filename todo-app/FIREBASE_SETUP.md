# Configuración de Firebase para TodoApp

## Pasos para configurar Firebase

### 1. Crear proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita Authentication y Firestore Database

### 2. Configurar Authentication

1. En la consola de Firebase, ve a **Authentication** > **Sign-in method**
2. Habilita **Google** como proveedor de autenticación
3. Configura tu dominio autorizado (localhost:3000 para desarrollo)

### 3. Configurar Firestore Database

1. Ve a **Firestore Database** > **Create database**
2. Selecciona "Start in test mode" (o usa las reglas de seguridad de firestore.rules)
3. Elige la región más cercana a tus usuarios

### 4. Obtener configuración del proyecto

1. Ve a **Project Settings** (ícono de engranaje)
2. En la sección "Your apps", crea una nueva Web App
3. Copia la configuración que te proporciona Firebase
4. Pega los valores en tu archivo `.env.local`

### 5. Variables de entorno

Actualiza tu archivo `.env.local` con los valores reales:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_real
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

### 6. Reglas de seguridad de Firestore

Aplica las reglas de seguridad del archivo `firestore.rules`:

1. Ve a **Firestore Database** > **Rules**
2. Copia y pega el contenido de `firestore.rules`
3. Haz clic en "Publish"

### 7. Despliegue en Vercel

Para desplegar en Vercel:

1. Conecta tu repositorio de GitHub a Vercel
2. Agrega las variables de entorno en la configuración de Vercel
3. Despliega tu aplicación
4. Agrega el dominio de Vercel a los dominios autorizados en Firebase Auth

## Características implementadas

- ✅ Autenticación con Google
- ✅ Todos por usuario (privados)
- ✅ Sincronización en tiempo real
- ✅ Persistencia en Firestore
- ✅ Manejo de estado de carga
- ✅ Interfaz de usuario adaptada

## Estructura de datos en Firestore

Cada todo se guarda con la siguiente estructura:

```javascript
{
  id: "auto-generated-id",
  userId: "firebase-user-uid",
  text: "Texto de la tarea",
  description: "Descripción opcional",
  completed: false,
  priority: "baja" | "media" | "alta",
  createdAt: Timestamp,
  updatedAt: Timestamp,
  dueDate: Timestamp | null
}
```

## Seguridad

- Los usuarios solo pueden ver y modificar sus propias tareas
- Las reglas de Firestore impiden el acceso a tareas de otros usuarios
- La autenticación es manejada por Firebase Auth (Google OAuth)
