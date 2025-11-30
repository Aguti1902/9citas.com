# 🎉 USUARIO DE PRUEBA CREADO

## ✅ Credenciales de acceso:

```
📧 Email:      test@9citas.com
🔑 Contraseña: test123
```

## 🌟 Características del usuario:

- **Nombre**: Usuario de Prueba
- **Edad**: 28 años
- **Ubicación**: Madrid
- **Orientación**: Hetero
- **Género**: Hombre
- **Plan**: 9Plus (Premium) - Activo por 1 año
- **Perfil completo**: ✅ Con descripción, hobbies, idiomas, etc.
- **Foto de portada**: ✅ Incluida

## 🚀 Cómo entrar:

### IMPORTANTE: Necesitas que el BACKEND esté corriendo

1. **Busca la terminal que dice "🔧 Iniciando BACKEND..."**
   - Debe mostrar: `🚀 Servidor corriendo en http://localhost:4000`
   - Si no lo ves, ejecuta en una terminal:
   ```bash
   cd /Users/guti/Desktop/CURSOR\ WEBS/9CITAS/backend
   npm run dev
   ```

2. **Una vez el backend funcione:**
   - Abre http://localhost:3000
   - Haz click en "Tengo 18 años y busco citas con heteros"
   - Haz click en "Inicia sesión"
   - Introduce:
     - Email: `test@9citas.com`
     - Contraseña: `test123`
   - Click en "ENTRAR COMO HETERO"

3. **¡Listo!** Deberías entrar y ver:
   - Tu perfil completo
   - Los filtros de búsqueda
   - Perfiles falsos para probar
   - Todas las funciones de 9Plus activadas

## ⚠️ Si no funciona el login:

### Prueba rápida del backend:
```bash
curl http://localhost:4000/api/health
```

**Debería responder**: `{"status":"ok","message":"9citas API is running"}`

Si dice "Connection refused", el backend no está corriendo:
- Revisa la terminal del backend
- Busca errores en rojo
- Cópiame el error exacto para arreglarlo

---

## 📝 Ventajas de este usuario:

✅ **Plan 9Plus activo** - Puedes usar TODAS las funciones premium:
- Ver todos los perfiles sin límite (usuarios gratis solo 50)
- Filtrar por edad
- Filtrar por distancia
- Ver quién te ha dado "Me gusta"
- Chatear con usuarios de cualquier ciudad
- Ver la distancia de otros perfiles

✅ **Email verificado** - No necesitas confirmar el email

✅ **Perfil completo** - Ya tiene toda la información necesaria

---

## 🔍 Otros usuarios de prueba:

Además de tu usuario, la base de datos debería tener perfiles falsos.
Puedes verlos en la sección "Navegar" cuando entres.

Si no hay perfiles, ejecuta:
```bash
cd /Users/guti/Desktop/CURSOR\ WEBS/9CITAS/backend
npm run seed
```

