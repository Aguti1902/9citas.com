# 🔐 Panel de Administración - Guía Completa

## 📋 Índice
1. [Configuración Inicial](#configuración-inicial)
2. [Acceso al Panel](#acceso-al-panel)
3. [Funcionalidades](#funcionalidades)
4. [Uso del Dashboard](#uso-del-dashboard)
5. [Gestión de Denuncias](#gestión-de-denuncias)
6. [Gestión de Usuarios](#gestión-de-usuarios)

---

## 🛠️ Configuración Inicial

### 1. Configurar Contraseña de Admin en Railway

1. **Ve a Railway:**
   - https://railway.app
   - Selecciona tu proyecto backend

2. **Agrega la variable de entorno:**
   - Ve a **Variables**
   - Click en **New Variable**
   - **Name:** `ADMIN_PASSWORD`
   - **Value:** `tu-contraseña-super-segura`

3. **Redeploy:**
   - Railway redeployará automáticamente
   - Espera 1-2 minutos

**⚠️ IMPORTANTE:** Usa una contraseña segura y no la compartas con nadie.

---

## 🚀 Acceso al Panel

### URL del Panel de Admin:

**Desarrollo:**
```
http://localhost:3000/admin/login
```

**Producción:**
```
https://9citas.com/admin/login
```

### Login:

1. Ingresa la contraseña que configuraste en `ADMIN_PASSWORD`
2. Click en **"Iniciar Sesión"**
3. Serás redirigido al Dashboard

**🔐 Seguridad:**
- El token JWT expira en 24 horas
- Después de 24 horas, deberás volver a iniciar sesión
- La URL `/admin` NO aparece en ningún menú público

---

## 📊 Funcionalidades

### Dashboard Principal (Actualizado)
- ✅ **Actualización automática cada 30 segundos**
- ✅ **Logo 9CITAS** en el header
- ✅ **Métricas principales con diseño mejorado:**
  - Total de usuarios (verificados/sin verificar/nuevos últimos 7 días)
  - Usuarios online y activos en las últimas 24h
  - Total de mensajes (con actividad últimas 24h)
  - Matches totales (likes mutuos)
- ✅ **Métricas secundarias:**
  - Suscripciones 9Plus activas con tasa de conversión
  - Conversaciones activas (últimos 7 días)
  - Tasa de verificación de email
  - Denuncias y bloqueos totales
- ✅ **Gráfico de registros** (últimos 7 días)
- ✅ **Estadísticas de perfiles:**
  - Perfiles reales vs falsos (con barras de progreso)
  - Distribución por orientación (hetero/gay)
- ✅ **Tasas de conversión:**
  - Verificación de email
  - Completado de perfil
  - Conversión a 9Plus
- ✅ **Top 5 usuarios más activos** (por mensajes)
- ✅ **Top 5 perfiles más reportados**
- ✅ **Integración con Google Analytics** (enlace directo)

### Gestión de Denuncias
- ✅ Ver todas las denuncias ordenadas por fecha
- ✅ Ver perfil del denunciante y denunciado
- ✅ Ver cantidad total de denuncias por usuario
- ✅ **Acciones:**
  - 🗑️ Eliminar usuario (borra todo: perfil, fotos, mensajes, etc.)
  - ✖️ Descartar denuncia (sin eliminar al usuario)

### Gestión de Usuarios
- ✅ Ver todos los usuarios registrados
- ✅ Buscar por nombre, email o ciudad
- ✅ Filtrar por: Todos / Reales / Falsos
- ✅ Ver estadísticas de cada usuario:
  - Mensajes enviados/recibidos
  - Likes enviados/recibidos
  - Denuncias recibidas
  - Estado de verificación
  - Fecha de registro
- ✅ **Acciones:**
  - 🗑️ Eliminar usuario completamente

---

## 📈 Uso del Dashboard

### Navegación Mejorada

El panel ahora cuenta con:
- **Header consistente** con logo 9CITAS y botón de cerrar sesión
- **Barra de navegación** con indicadores visuales de página activa
- **Diseño responsive** optimizado para desktop y móvil

### Estadísticas en Tiempo Real

El dashboard se actualiza automáticamente cada 30 segundos, mostrando:

**Usuarios:**
```
- Total Usuarios: 150
- Verificados: 120
- Sin verificar: 30
- Online: 25
- Nuevos (7 días): 15
```

**Actividad:**
```
- Mensajes: 5,432
- Likes: 1,234
- Favoritos: 567
- Denuncias: 8
- Bloqueos: 12
```

**Perfiles:**
```
- Total: 150
- Reales: 50
- Falsos: 100
- Hetero: 90
- Gay: 60
```

### Navegación

```
┌─────────────────────────────────────┐
│  Dashboard  │  Denuncias  │ Usuarios │
└─────────────────────────────────────┘
```

- **Dashboard:** Estadísticas generales
- **Denuncias:** Gestión de reportes
- **Usuarios:** Lista y gestión de usuarios

---

## ⚠️ Gestión de Denuncias

### Tipos de Denuncias

1. **Estafa / Spam** (`scam`)
2. **Fotos Inapropiadas** (`inappropriate_photos`)
3. **Solicitud de Dinero** (`money_request`)
4. **Fotos Falsas** (`fake_photos`)
5. **Menor de Edad** (`underage`)

### Vista de Denuncias

Para cada denuncia verás:

```
┌─────────────────────────────────────────┐
│  [Foto]  Nombre del Denunciado          │
│          email@ejemplo.com              │
│          ⚠️ 3 denuncias totales         │
│                                         │
│  🚨 Motivo: Fotos Inapropiadas         │
│  👤 Denunciado por: Juan               │
│  📅 15/12/2025, 10:30                  │
│                                         │
│  [Eliminar Usuario] [Descartar Denuncia]│
└─────────────────────────────────────────┘
```

### Acciones

**1. Eliminar Usuario:**
- ⚠️ Acción IRREVERSIBLE
- Borra:
  - Usuario y perfil
  - Todas las fotos
  - Todos los mensajes
  - Todos los likes y favoritos
  - Todas las denuncias relacionadas
  - Suscripciones

**2. Descartar Denuncia:**
- Solo elimina la denuncia específica
- El usuario permanece en la plataforma

### Flujo Recomendado

```
1. Revisar el perfil denunciado
2. Verificar cantidad total de denuncias
3. Evaluar la gravedad
4. Tomar acción:
   - Si es grave o reincidente → Eliminar Usuario
   - Si es falsa alarma → Descartar Denuncia
```

---

## 👥 Gestión de Usuarios

### Búsqueda y Filtros

**Búsqueda:**
- Por nombre de perfil
- Por email
- Por ciudad

**Filtros:**
- **Todos:** Muestra todos los usuarios
- **Reales:** Solo usuarios reales (no falsos)
- **Falsos:** Solo perfiles falsos generados automáticamente

### Vista de Usuario

Para cada usuario verás:

```
┌──────────────────────────────────────────┐
│  [Foto]  Nombre, 28 años                │
│          email@ejemplo.com              │
│          Registrado: 01/12/2025         │
│          ✓ Verificado                   │
│                                         │
│  📍 Madrid • 👫 hetero                  │
│                                         │
│  📊 Estadísticas:                       │
│  💬 150 mensajes                        │
│  ❤️ 45 likes                            │
│  ⚠️ 2 denuncias                         │
│                                         │
│                    [Eliminar Usuario]   │
└──────────────────────────────────────────┘
```

### Estados de Usuario

**Indicadores visuales:**
- ✅ `✓ Verificado` - Email verificado
- ❌ `✗ Sin verificar` - Email no verificado
- 🟢 Punto verde - Usuario online
- 🏷️ `Falso` - Perfil falso generado automáticamente
- 🔷 Icono verificado azul - Perfil verificado manualmente

---

## 🔒 Seguridad

### Buenas Prácticas

1. **Contraseña Fuerte:**
   - Mínimo 16 caracteres
   - Letras, números y símbolos
   - No uses contraseñas comunes

2. **No Compartir:**
   - La contraseña es personal
   - No la compartas por email/chat
   - Cámbiala periódicamente

3. **Cerrar Sesión:**
   - Siempre cierra sesión al terminar
   - Especialmente en computadoras públicas

4. **URL Oculta:**
   - `/admin` no aparece en menús públicos
   - No la compartas públicamente

### Renovar Token

El token JWT expira en **24 horas**. Después de ese tiempo:

1. Serás redirigido automáticamente a `/admin/login`
2. Vuelve a ingresar la contraseña
3. Obtendrás un nuevo token por 24 horas

---

## 📊 Google Analytics Integration

### Configuración de Google Analytics

Para habilitar el tracking de Google Analytics en 9citas.com:

1. **Obtén tu ID de Google Analytics 4:**
   - Ve a https://analytics.google.com
   - Crea una propiedad GA4 si no tienes una
   - Copia el ID (formato: `G-XXXXXXXXXX`)

2. **Configura la variable de entorno en Vercel:**
   - Ve a tu proyecto en Vercel
   - Settings → Environment Variables
   - Agrega: `VITE_GA_TRACKING_ID` = `G-XXXXXXXXXX`
   - Redeploy el frontend

3. **Accede a Google Analytics desde el Dashboard:**
   - En el dashboard de admin, encontrarás un botón directo a Google Analytics
   - Ahí podrás ver métricas avanzadas en tiempo real

### Métricas que se trackean automáticamente:

**Autenticación:**
- Registros (sign_up)
- Logins (login)

**Perfil:**
- Visualizaciones de perfil (view_profile)
- Ediciones de perfil (edit_profile)

**Interacciones:**
- Mensajes enviados (send_message)
- Likes enviados (send_like)
- Favoritos agregados (add_favorite)
- Swipes (swipe)
- Matches (match)

**Premium:**
- Visualización de features premium (view_premium_features)
- Inicio de checkout (begin_checkout)
- Compras completadas (purchase)

**Moderación:**
- Reportes de usuarios (report_user)
- Bloqueos (block_user)

### Dashboards recomendados en Google Analytics:

1. **Realtime Overview:** Ver usuarios activos en este momento
2. **User Acquisition:** De dónde vienen tus usuarios
3. **Engagement:** Tiempo en sitio, páginas por sesión
4. **Conversions:** Seguimiento de registros y compras
5. **Events:** Todos los eventos personalizados listados arriba

---

## 📱 Responsive

El panel de admin es **completamente responsive** y funciona en:

- ✅ Desktop (1920x1080 o superior)
- ✅ Laptop (1366x768 o superior)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667 o superior)

---

## ❓ FAQ

### ¿Cómo cambio la contraseña de admin?

1. Ve a Railway → Variables
2. Edita `ADMIN_PASSWORD`
3. Guarda y espera el redeploy

### ¿Qué pasa si olvido la contraseña?

Solo tú tienes acceso a Railway, así que:
1. Ve a Railway → Variables
2. Consulta el valor de `ADMIN_PASSWORD`
3. O cambiala por una nueva

### ¿Puedo crear múltiples admins?

Actualmente no. Solo hay una contraseña de admin compartida. Si necesitas múltiples admins con diferentes permisos, habría que implementar un sistema de roles.

### ¿Las acciones son reversibles?

**NO.** Eliminar un usuario es **irreversible**. Asegúrate de revisar bien antes de eliminar.

### ¿Se notifica al usuario cuando es eliminado?

No. El usuario simplemente no podrá iniciar sesión y verá un error de "usuario no encontrado".

---

## 🎨 Interfaz

El panel usa:
- **Tema oscuro** (fondo negro/gris)
- **Acentos morados y rosas** (consistente con 9citas)
- **Glassmorphism** (efectos de vidrio esmerilado)
- **Animaciones suaves** (hover, transiciones)

---

## 🚨 Soporte

Si tienes problemas:

1. **Verifica la contraseña** en Railway
2. **Revisa los logs** del backend en Railway
3. **Limpia el localStorage** del navegador:
   ```js
   localStorage.removeItem('adminToken')
   ```
4. **Intenta en modo incógnito** para descartar caché

---

## ✅ Checklist de Configuración

- [ ] Variable `ADMIN_PASSWORD` configurada en Railway
- [ ] Backend redeployado exitosamente
- [ ] Frontend desplegado en Vercel
- [ ] Login funciona correctamente
- [ ] Dashboard muestra estadísticas
- [ ] Denuncias se cargan correctamente
- [ ] Usuarios se cargan correctamente
- [ ] Acciones (eliminar) funcionan

---

**¡Listo! Tu panel de administración está funcionando.** 🎉

