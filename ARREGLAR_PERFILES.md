# 🔧 SOLUCIÓN PARA VER LOS PERFILES

## PROBLEMA
Tu perfil no tiene la orientación correcta, por eso no ves los 284 perfiles falsos.

## SOLUCIÓN RÁPIDA

### Opción 1: Cerrar sesión y volver a registrarte (RECOMENDADO)

1. Click en el icono de **Logout** (arriba derecha)
2. Volver a la página de inicio
3. Click en "Tengo 18 años y busco citas con heteros"
4. **REGÍSTRATE** (no login) con un nuevo email:
   - Email: `nuevo@email.com`
   - Password: `123456`
5. Completar perfil
6. ¡Ahora verás todos los perfiles!

### Opción 2: Usar SQL para arreglar tu perfil actual

Ejecuta en la terminal:

```bash
psql -U guti -d 9citas -c "UPDATE profiles SET orientation = 'hetero' WHERE city = 'barcelona';"
```

Luego **recarga la página** (F5).

## VERIFICAR QUE FUNCIONA

Después de cualquiera de las dos opciones, deberías ver:
- Cards de perfiles en la página "Navegar"
- 143 perfiles hetero (si elegiste hetero)
- 141 perfiles gay (si elegiste gay)

## ¿POR QUÉ PASÓ ESTO?

Había un bug en el registro que no guardaba la orientación correctamente. Ya está arreglado en el código, pero tu perfil actual quedó sin orientación.

