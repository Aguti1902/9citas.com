# ✅ Seguir Instrucciones de Hostinger

## 📋 Verificación Paso a Paso

### Paso 1: Verificar DNS (Ya Está Configurado ✅)

**Ya tienes:**
- ✅ Registro A para `@` → `84.32.84.32`
- ✅ Registro CNAME para `www` → `9citas.com`

**Verificar desde el servidor:**

```bash
dig 9citas.com +short
# Debería mostrar: 84.32.84.32

dig www.9citas.com +short
# Debería mostrar: 84.32.84.32
```

---

### Paso 2: Verificar Nginx (Ya Está Configurado ✅)

**Ya tienes:**
- ✅ Configuración en `/etc/nginx/sites-available/9citas-frontend`
- ✅ Enlace simbólico en `/etc/nginx/sites-enabled/`
- ✅ Frontend funciona correctamente

**Verificar:**

```bash
# Ver configuración
cat /etc/nginx/sites-available/9citas-frontend

# Verificar sintaxis
sudo nginx -t

# Ver estado
sudo systemctl status nginx
```

---

### Paso 3: Instalar Certbot (Si No Está Instalado)

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

---

### Paso 4: Intentar Certbot de Nuevo

**Ahora que todo está configurado correctamente:**

```bash
sudo certbot --nginx -d 9citas.com -d www.9citas.com
```

**Certbot te hará preguntas:**
- Email: tu email
- Términos: Y (Yes)
- Compartir email: N (No)
- Redirigir HTTP a HTTPS: 2 (Sí, redirigir)

---

## 🔍 Si Certbot Sigue Fallando

### Verificar que el Dominio Responde Correctamente

```bash
# Desde el servidor
curl -I http://9citas.com

# Debería mostrar: HTTP/1.1 200 OK
```

---

### Verificar que No Hay CDN Interfiriendo

**Desde tu ordenador:**

```bash
curl -I http://9citas.com
```

**Si muestra `Server: hcdn`:** El CDN está activo y puede estar bloqueando.

**Solución:** Deshabilitar CDN temporalmente en Hostinger o usar DNS challenge.

---

### Usar DNS Challenge (Si HTTP Challenge Falla)

```bash
sudo certbot certonly --manual --preferred-challenges dns -d 9citas.com -d www.9citas.com
```

**Sigue las instrucciones de Certbot para añadir el registro TXT en DNS.**

---

## ✅ Después de Obtener el Certificado

Certbot configurará automáticamente Nginx para usar HTTPS. Solo necesitas verificar:

```bash
# Verificar configuración
cat /etc/nginx/sites-available/9citas-frontend

# Verificar sintaxis
sudo nginx -t

# Recargar
sudo systemctl reload nginx

# Probar HTTPS
curl https://9citas.com
```

---

## 📋 Comandos Completos

```bash
# 1. Verificar DNS
dig 9citas.com +short
dig www.9citas.com +short

# 2. Verificar Nginx
sudo nginx -t
sudo systemctl status nginx

# 3. Instalar Certbot (si no está)
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# 4. Intentar Certbot
sudo certbot --nginx -d 9citas.com -d www.9citas.com

# 5. Si falla, usar DNS challenge
sudo certbot certonly --manual --preferred-challenges dns -d 9citas.com -d www.9citas.com
```

