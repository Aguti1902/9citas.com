# Fotos de Perfiles Falsos

## Estructura de Carpetas

Crea carpetas con el nombre de cada chica (ej: `chica1/`, `chica2/`, etc.) y dentro de cada carpeta coloca las fotos de esa persona.

### Ejemplo de estructura:

```
fake-profiles-photos/
├── chica1/
│   ├── foto1.jpg
│   ├── foto2.jpg
│   ├── foto3.jpg
│   └── foto4.jpg
├── chica2/
│   ├── foto1.jpg
│   ├── foto2.jpg
│   └── foto3.jpg
└── chica3/
    ├── foto1.jpg
    └── foto2.jpg
```

## Instrucciones

1. **Crea carpetas** para cada chica (puedes usar cualquier nombre: `chica1`, `chica2`, `maria`, `sofia`, etc.)

2. **Coloca las fotos** de cada chica en su carpeta correspondiente

3. **Ejecuta el script** para subir las fotos a Cloudinary:
   ```bash
   cd backend
   npx ts-node src/scripts/upload-fake-photos.ts
   ```

4. **Las fotos se subirán a Cloudinary** y se guardarán las URLs en un archivo JSON

5. **Ejecuta el seed** para crear los perfiles con estas fotos:
   ```bash
   npx prisma db seed
   ```

## Notas

- Las fotos deben ser: JPG, JPEG, PNG o WEBP
- Tamaño máximo recomendado: 5MB por foto
- La primera foto de cada carpeta se usará como foto de portada (cover)
- Las demás se usarán como fotos públicas

