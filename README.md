# 9citas.com 💘

Aplicación web de citas moderna y completa con funcionalidades premium, sistema de matching y chat en tiempo real.

## 🚀 Características Principales

### 👤 Sistema de Usuarios
- Registro y autenticación con JWT
- Verificación de correo electrónico
- Perfiles completos con múltiples campos (altura, profesión, hobbies, etc.)
- Fotos públicas (1 portada + 3 adicionales) y privadas (4 fotos con sistema de permisos)
- Separación estricta entre usuarios hetero y gay

### 💫 Funcionalidades Core
- **Navegación estilo Tinder**: Swipe left/right para dar like o pasar
- **Sistema de Matching**: Chat solo disponible con match mutuo (usuarios gratis)
- **Geolocalización**: Búsqueda por ciudad con cálculo de distancia
- **Filtros avanzados**: Por edad, distancia, online, nuevos
- **Chat en tiempo real**: Mensajes, envío de fotos privadas, ubicación
- **Sistema de Likes**: Dar y recibir likes (bloqueados para usuarios gratis)

### ⭐ Plan 9Plus (Premium)
- Ver todos los perfiles sin límite (gratis: máx 50)
- Chatear desde cualquier ciudad
- Ver quién te ha dado like
- Filtros por edad y online
- Ver distancia exacta entre perfiles

### ⚡ Función Roam
- Boost de visibilidad por 1 hora (6,49€)
- Multiplicador x8-x10 de visualizaciones
- Widget en tiempo real con contador
- Resumen de resultados al finalizar

### 📱 PWA (Progressive Web App)
- Instalable en móvil y escritorio
- Funciona como app nativa
- Icono personalizado
- Modo offline básico

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** + **TypeScript**
- **Vite** (build tool)
- **TailwindCSS** (estilos)
- **Zustand** (state management)
- **React Query** (data fetching)
- **React Router** (navegación)
- **Lucide React** (iconos)
- **Axios** (HTTP client)

### Backend
- **Node.js** + **TypeScript**
- **Express** (framework)
- **Prisma** (ORM)
- **PostgreSQL** (base de datos)
- **JWT** (autenticación)
- **bcrypt** (hash de contraseñas)
- **Multer** (upload de archivos)

## 📦 Instalación y Configuración

### Requisitos Previos
- Node.js 18+ 
- PostgreSQL 14+
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone https://github.com/Aguti1902/9citas.com.git
cd 9citas.com
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

Crear archivo `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/9citas?schema=public"
JWT_SECRET="tu_secreto_jwt_super_seguro_aqui"
JWT_REFRESH_SECRET="tu_secreto_refresh_jwt_super_seguro_aqui"
PORT=4000
```

Inicializar base de datos:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

Iniciar backend:
```bash
npm run dev
```

### 3. Configurar Frontend

```bash
cd frontend
npm install
```

Crear archivo `.env`:
```env
VITE_API_URL=http://localhost:4000
```

Iniciar frontend:
```bash
npm run dev
```

### 4. Acceder a la aplicación

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## 🎯 Usuarios de Prueba

Después del seed, puedes usar:
- **Email**: test@9citas.com
- **Password**: Test1234!

O registrar un nuevo usuario desde la aplicación.

## 📱 Instalación como PWA

### En móvil (iOS):
1. Abre Safari → http://localhost:3000
2. Toca "Compartir" (□↑)
3. "Añadir a pantalla de inicio"

### En móvil (Android):
1. Abre Chrome → http://localhost:3000
2. Menú (⋮) → "Añadir a pantalla de inicio"

### En escritorio:
1. Haz clic en el botón "Instalar 9citas" (campana verde)

## 🚀 Despliegue en Vercel

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

Variables de entorno en Vercel:
- `VITE_API_URL`: URL de tu backend en producción

### Backend (Vercel o Railway)
```bash
cd backend
vercel --prod
```

Variables de entorno:
- `DATABASE_URL`: URL de PostgreSQL en producción
- `JWT_SECRET`: Secreto JWT
- `JWT_REFRESH_SECRET`: Secreto refresh JWT
- `PORT`: 4000

## 📂 Estructura del Proyecto

```
9citas/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Esquema de base de datos
│   │   └── seed.ts            # Datos de prueba
│   ├── src/
│   │   ├── controllers/       # Lógica de negocio
│   │   ├── middleware/        # Auth, validaciones
│   │   ├── routes/            # Rutas API
│   │   └── index.ts           # Entry point
│   └── uploads/               # Fotos subidas
├── frontend/
│   ├── public/
│   │   ├── app-icon.png       # Icono PWA
│   │   └── manifest.json      # PWA config
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── pages/             # Páginas
│   │   ├── services/          # API calls
│   │   ├── store/             # Zustand stores
│   │   └── main.tsx           # Entry point
│   └── index.html
└── README.md
```

## 🔐 Seguridad

- Contraseñas hasheadas con bcrypt
- JWT con refresh tokens
- Validación de datos en backend
- CORS configurado
- Sanitización de inputs
- Rate limiting (recomendado para producción)

## 🎨 Diseño

- **Mobile-first**: Optimizado para móviles
- **Dark theme**: Fondo #000000
- **Colores corporativos**:
  - Primary: #fc4d5c (rosa/rojo)
  - Accent: #ffcc00 (amarillo)
  - Info: #00a3e8 (azul)
  - Success: #01cc00 (verde)
  - Warning: #ff6600 (naranja)

## 📄 Licencia

Proyecto privado - Todos los derechos reservados © 2025 9citas.com

## 👨‍💻 Autor

Desarrollado por Aguti1902

## 🐛 Reportar Bugs

Para reportar bugs o solicitar features, abre un issue en GitHub.

---

**¡Disfruta conectando con personas increíbles! 💘**
