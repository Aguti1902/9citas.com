# 🔧 Configurar DNS en Hostinger

## ❌ El Problema

Tu dominio `9citas.com` está usando nameservers de parking (`ns1.dns-parking.com`), por eso no apunta a tu VPS y Certbot no puede verificar el dominio.

---

## ✅ Solución: Configurar Registros DNS

### Paso 1: Editar DNS en Hostinger

1. **En el panel de Hostinger, haz clic en "Editar DNS"** (botón al lado de "Activo")
2. **Se abrirá la configuración de DNS**

---

### Paso 2: Añadir Registros A

**Necesitas añadir estos registros:**

1. **Registro A para el dominio principal:**
   - **Nombre/Host:** `@` o `9citas.com`
   - **Tipo:** `A`
   - **Valor/IP:** `84.32.84.32` (IP de tu VPS)
   - **TTL:** `3600` (o el valor por defecto)

2. **Registro A para www:**
   - **Nombre/Host:** `www`
   - **Tipo:** `A`
   - **Valor/IP:** `84.32.84.32` (IP de tu VPS)
   - **TTL:** `3600` (o el valor por defecto)

3. **Registro A para api (opcional, para la API):**
   - **Nombre/Host:** `api`
   - **Tipo:** `A`
   - **Valor/IP:** `84.32.84.32` (IP de tu VPS)
   - **TTL:** `3600` (o el valor por defecto)

---

### Paso 3: Verificar IP de tu VPS

**Si no estás seguro de la IP, desde la terminal:**

```bash
curl ifconfig.me
```

**O verifica en el panel de Hostinger:**
- Ve a "VPS" → Tu servidor
- Busca la IP pública

---

### Paso 4: Guardar y Esperar

1. **Guarda los cambios** en el panel de Hostinger
2. **Espera 5-10 minutos** para que los cambios se propaguen

---

### Paso 5: Verificar que Funciona

**Desde la terminal de Hostinger:**

```bash
# Verificar DNS
dig 9citas.com +short
dig www.9citas.com +short

# Ambos deberían mostrar: 84.32.84.32
```

**Desde tu ordenador:**

```bash
# Probar acceso
curl -I http://9citas.com

# Debería mostrar: HTTP/1.1 200 OK
```

---

## 🔄 Si los Nameservers Siguen en Parking

**Si después de configurar los registros A, los nameservers siguen siendo de parking:**

1. **Ve a la sección de "Nameservers" en Hostinger**
2. **Cambia los nameservers a los de Hostinger:**
   - `ns1.dns.hostinger.com`
   - `ns2.dns.hostinger.com`
   - `ns3.dns.hostinger.com`
   - `ns4.dns.hostinger.com`

**O pregunta a Hostinger cuáles son los nameservers correctos para tu cuenta.**

---

## ✅ Después de Configurar DNS

### 1. Iniciar Nginx

```bash
sudo systemctl start nginx
```

---

### 2. Verificar que el Dominio Responde

```bash
# Desde el servidor
curl -I http://9citas.com

# Debería mostrar: HTTP/1.1 200 OK
```

---

### 3. Intentar Certbot de Nuevo

**Espera 10-15 minutos después de configurar DNS, luego:**

```bash
# Con Nginx corriendo
sudo certbot --nginx -d 9citas.com -d www.9citas.com
```

**O con standalone:**

```bash
sudo systemctl stop nginx
sudo certbot certonly --standalone -d 9citas.com -d www.9citas.com
sudo systemctl start nginx
```

---

## 📋 Resumen de Pasos

1. **En Hostinger:**
   - Haz clic en "Editar DNS"
   - Añade registro A: `@` → `84.32.84.32`
   - Añade registro A: `www` → `84.32.84.32`
   - Añade registro A: `api` → `84.32.84.32` (opcional)
   - Guarda cambios

2. **Espera 10-15 minutos**

3. **Verifica DNS:**
   ```bash
   dig 9citas.com +short
   # Debería mostrar: 84.32.84.32
   ```

4. **Inicia Nginx:**
   ```bash
   sudo systemctl start nginx
   ```

5. **Intenta Certbot de nuevo:**
   ```bash
   sudo certbot --nginx -d 9citas.com -d www.9citas.com
   ```

---

## 🆘 Si Sigue Fallando

### Verificar que el Dominio Apunta Correctamente

```bash
# Desde el servidor
dig 9citas.com +short
nslookup 9citas.com

# Ambos deberían mostrar: 84.32.84.32
```

**Si muestra otra IP o nada:** Los DNS no se han propagado todavía, espera más tiempo.

---

### Contactar con Hostinger

Si después de configurar los registros A y esperar, el dominio sigue sin apuntar correctamente:

1. **Contacta con el soporte de Hostinger**
2. **Pregunta cómo configurar el DNS para que apunte a tu VPS**
3. **O pregunta si necesitas cambiar los nameservers**

