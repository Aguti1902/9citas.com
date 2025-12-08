# 📧 Cómo Configurar Email (SMTP) para Confirmación de Registro

## 🔧 Paso 1: Obtener Contraseña de Aplicación de Gmail

Si usas Gmail, necesitas crear una "Contraseña de aplicación":

1. Ve a: https://myaccount.google.com/security
2. Activa "Verificación en 2 pasos" (si no está activada)
3. Busca "Contraseñas de aplicaciones" o "App passwords"
4. Selecciona "Correo" y "Otro (nombre personalizado)"
5. Escribe: "9citas Hostinger"
6. Haz clic en "Generar"
7. **Copia la contraseña de 16 caracteres** (se muestra solo una vez)

---

## 📝 Paso 2: Editar el archivo .env en Hostinger

En la terminal de Hostinger, ejecuta:

```bash
cd ~/9citas.com/backend
nano .env
```

---

## ✏️ Paso 3: Buscar y Editar las Líneas de Email

En nano, busca las líneas que dicen:

```
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password_gmail
```

**Cámbialas por tus datos reales:**

```
SMTP_USER=TU_EMAIL_REAL@gmail.com
SMTP_PASS=TU_CONTRASEÑA_DE_APLICACIÓN_DE_16_CARACTERES
```

**Ejemplo:**
```
SMTP_USER=miemail@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
```

> ⚠️ **IMPORTANTE:** Si la contraseña tiene espacios, quítalos o ponla entre comillas: `SMTP_PASS="abcd efgh ijkl mnop"`

---

## 💾 Paso 4: Guardar

1. Presiona `Ctrl + X`
2. Presiona `Y` (para confirmar)
3. Presiona `Enter`

---

## ✅ Paso 5: Reiniciar el Servidor

Después de guardar, reinicia PM2 para que cargue los nuevos valores:

```bash
pm2 restart 9citas-backend
```

---

## 🧪 Paso 6: Probar que Funciona

Una vez que el servidor esté funcionando, intenta registrarte con un email nuevo. Deberías recibir el email de confirmación.

---

## 🔍 Verificar que Está Correcto

Para verificar que los valores están bien, puedes ver el archivo:

```bash
cd ~/9citas.com/backend
cat .env | grep SMTP
```

Deberías ver algo como:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_contraseña_de_aplicación
REPORTS_EMAIL=denuncias@9citas.com
```

---

## ❓ Si No Tienes Gmail

Si usas otro proveedor de email, cambia estos valores:

**Outlook/Hotmail:**
```
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

**Yahoo:**
```
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

**Otro proveedor:**
Busca en Google: "SMTP settings [tu proveedor]"

---

## 🆘 Problemas Comunes

### Error: "Invalid login"
- Verifica que la contraseña de aplicación sea correcta
- Asegúrate de que no tenga espacios o quítalos
- Verifica que el email sea correcto

### Error: "Connection timeout"
- Verifica que SMTP_HOST y SMTP_PORT sean correctos
- Algunos proveedores bloquean conexiones desde servidores, puede que necesites usar otro servicio

### No llegan los emails
- Revisa la carpeta de spam
- Verifica que el email de destino sea válido
- Revisa los logs: `pm2 logs 9citas-backend`

