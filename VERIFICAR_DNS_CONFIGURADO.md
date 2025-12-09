# ✅ Verificar DNS Configurado

## ✅ Estado Actual

- ✅ Registro A para `@` → `84.32.84.32` (CORRECTO)
- ✅ Registro CNAME para `www` → `9citas.com` (CORRECTO)
- ✅ Registros CAA (para SSL) (CORRECTO)

**El DNS está configurado correctamente.**

---

## 🔍 Verificaciones Necesarias

### Paso 1: Verificar que el DNS se Ha Propagado

**Desde la terminal de Hostinger:**

```bash
# Verificar DNS
dig 9citas.com +short
dig www.9citas.com +short

# Ambos deberían mostrar: 84.32.84.32
```

**Si muestra otra IP o nada:** Espera más tiempo (puede tardar hasta 24 horas, pero normalmente 10-15 minutos).

---

### Paso 2: Verificar que el Dominio Responde

```bash
# Desde el servidor
curl -I http://9citas.com

# Debería mostrar: HTTP/1.1 200 OK
```

**Si muestra error o timeout:** El DNS no se ha propagado todavía o hay un problema con Nginx.

---

### Paso 3: Añadir Registro A para API (Opcional)

**Si quieres usar `api.9citas.com`:**

1. **En Hostinger, añade un nuevo registro:**
   - **Tipo:** `A`
   - **Nombre:** `api`
   - **Contenido:** `84.32.84.32`
   - **TTL:** `3600` (o el valor por defecto)

2. **Guarda los cambios**

---

## ✅ Después de Verificar DNS

### 1. Iniciar Nginx

```bash
sudo systemctl start nginx
```

---

### 2. Verificar que Nginx Está Corriendo

```bash
sudo systemctl status nginx
```

**Debería decir:** "active (running)"

---

### 3. Probar que el Frontend Responde

```bash
# Desde el servidor
curl http://localhost

# Debería mostrar HTML del frontend (no la página por defecto)
```

---

### 4. Probar desde Fuera (desde tu ordenador)

```bash
# Desde tu ordenador (NO desde Hostinger)
curl -I http://9citas.com

# Debería mostrar: HTTP/1.1 200 OK
```

---

### 5. Intentar Certbot de Nuevo

**Espera 10-15 minutos después de verificar que el DNS está propagado, luego:**

```bash
# Con Nginx corriendo
sudo certbot --nginx -d 9citas.com -d www.9citas.com
```

**O con standalone (si el anterior falla):**

```bash
sudo systemctl stop nginx
sudo certbot certonly --standalone -d 9citas.com -d www.9citas.com
sudo systemctl start nginx
```

---

## 🔍 Si el DNS No Se Ha Propagado

### Verificar desde Diferentes Servidores

```bash
# Desde Hostinger
dig 9citas.com +short

# Desde Google DNS
dig @8.8.8.8 9citas.com +short

# Desde Cloudflare DNS
dig @1.1.1.1 9citas.com +short
```

**Todos deberían mostrar:** `84.32.84.32`

**Si algunos muestran otra IP o nada:** El DNS todavía se está propagando, espera más tiempo.

---

## 📋 Checklist Completo

Antes de intentar Certbot:

- [ ] DNS configurado correctamente ✅ (ya lo tienes)
- [ ] DNS propagado (`dig 9citas.com +short` muestra `84.32.84.32`)
- [ ] Nginx corriendo (`sudo systemctl status nginx`)
- [ ] Frontend responde (`curl http://localhost` muestra HTML)
- [ ] Dominio responde desde fuera (`curl -I http://9citas.com` desde tu ordenador)
- [ ] Esperado 10-15 minutos después de configurar DNS

---

## 🆘 Si Sigue Fallando

### Verificar Nameservers

**Si los nameservers siguen siendo de parking:**

1. **Ve a la configuración de nameservers en Hostinger**
2. **Cámbialos a los de Hostinger:**
   - `ns1.dns.hostinger.com`
   - `ns2.dns.hostinger.com`
   - `ns3.dns.hostinger.com`
   - `ns4.dns.hostinger.com`

**O pregunta a Hostinger cuáles son los nameservers correctos para tu cuenta.**

---

### Ver Logs de Certbot

```bash
sudo tail -100 /var/log/letsencrypt/letsencrypt.log
```

**Busca errores específicos.**

---

### Probar con --dry-run

```bash
sudo certbot --nginx -d 9citas.com -d www.9citas.com --dry-run -v
```

**Esto mostrará más detalles sin hacer cambios reales.**

