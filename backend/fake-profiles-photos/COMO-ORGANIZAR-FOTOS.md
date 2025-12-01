# 📸 CÓMO ORGANIZAR LAS FOTOS DE LAS CHICAS

## 📁 Estructura de Carpetas

Crea **una carpeta por cada chica** dentro de `backend/fake-profiles-photos/`.

### ✅ Estructura Correcta:

```
backend/fake-profiles-photos/
│
├── chica1/              ← Carpeta de la primera chica
│   ├── foto1.jpg        ← Primera foto = PORTADA (cover)
│   ├── foto2.jpg        ← Segunda foto = Pública
│   ├── foto3.jpg        ← Tercera foto = Pública
│   └── foto4.jpg        ← Cuarta foto = Pública (opcional)
│
├── chica2/              ← Carpeta de la segunda chica
│   ├── foto1.jpg        ← Primera foto = PORTADA
│   ├── foto2.jpg        ← Segunda foto = Pública
│   └── foto3.jpg        ← Tercera foto = Pública
│
├── maria/               ← Puedes usar cualquier nombre
│   ├── foto1.jpg
│   ├── foto2.jpg
│   └── foto3.jpg
│
└── sofia/               ← Otra chica
    ├── foto1.jpg
    └── foto2.jpg
```

## 📋 Reglas Importantes:

1. **Una carpeta = Una chica**
   - Cada carpeta contiene las fotos de UNA sola persona
   - Puedes usar cualquier nombre para la carpeta (chica1, maria, sofia, etc.)

2. **Primera foto = Portada (Cover)**
   - La primera foto de cada carpeta será la foto de portada del perfil
   - Esta es la foto principal que se verá en las tarjetas

3. **Resto de fotos = Públicas**
   - Las demás fotos serán fotos públicas del perfil
   - Máximo 3 fotos públicas (el script tomará las primeras 3)

4. **Formatos permitidos:**
   - ✅ JPG / JPEG
   - ✅ PNG
   - ✅ WEBP

5. **Tamaño recomendado:**
   - Máximo 5MB por foto
   - El script las optimizará automáticamente

## 🚀 Pasos para Añadir Fotos:

### Paso 1: Crear las carpetas
```bash
cd backend/fake-profiles-photos
mkdir chica1
mkdir chica2
mkdir chica3
# etc...
```

### Paso 2: Copiar las fotos
- Copia las fotos de cada chica a su carpeta correspondiente
- Asegúrate de que la mejor foto esté primero (será la portada)

### Paso 3: Ejecutar el script
```bash
cd backend
npx ts-node src/scripts/upload-fake-photos.ts
```

### Paso 4: Crear los perfiles
```bash
npx prisma db seed
```

## 💡 Ejemplo Práctico:

Si tienes fotos de 3 chicas:

**Chica 1 (María):**
- `chica1/foto1.jpg` ← Su mejor foto (portada)
- `chica1/foto2.jpg` ← Otra foto
- `chica1/foto3.jpg` ← Otra foto

**Chica 2 (Sofía):**
- `chica2/foto1.jpg` ← Su mejor foto (portada)
- `chica2/foto2.jpg` ← Otra foto

**Chica 3 (Laura):**
- `chica3/foto1.jpg` ← Su mejor foto (portada)
- `chica3/foto2.jpg` ← Otra foto
- `chica3/foto3.jpg` ← Otra foto
- `chica3/foto4.jpg` ← Otra foto (solo se usarán las primeras 3 públicas)

## ⚠️ Importante:

- **NO** pongas todas las fotos en una sola carpeta
- **NO** mezcles fotos de diferentes chicas en la misma carpeta
- **SÍ** usa una carpeta separada para cada chica
- **SÍ** pon la mejor foto primero (será la portada)

## 📝 Notas:

- Los nombres de las carpetas no importan (pueden ser chica1, maria, sofia, etc.)
- Los nombres de los archivos tampoco importan (pueden ser foto1.jpg, IMG_001.jpg, etc.)
- El script procesará las fotos en orden alfabético
- Si una carpeta tiene más de 4 fotos, solo se usarán las primeras 4 (1 cover + 3 públicas)

