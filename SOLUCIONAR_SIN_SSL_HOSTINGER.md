# 🔧 Soluciones sin SSL desde Hostinger

## ❌ No Hay Opción de SSL en Hostinger

Necesitamos otras soluciones para obtener el certificado SSL.

---

## ✅ Solución 1: Deshabilitar CDN Temporalmente

### Verificar si el CDN Está Activo

```bash
# Desde el servidor, verificar IP directa
curl -I http://84.32.84.32

# Comparar con el dominio
curl -I http://9citas.com
```

**Si la IP directa muestra `Server: nginx` pero el dominio muestra `Server: hcdn`:** El CDN está activo.

---

### Deshabilitar CDN en Hostinger

1. **Ve al panel de Hostinger**
2. **Busca "CDN", "Aceleración", "Cloudflare" o "Proxy"**
3. **Deshabilita el CDN temporalmente**
4. **Espera 10-15 minutos para que se propague**

---

### Intentar Certbot Después de Deshabilitar CDN

```bash
sudo certbot --nginx -d 9citas.com -d www.9citas.com
```

---

## ✅ Solución 2: Usar Certbot con DNS Challenge

**Esta opción no requiere acceso HTTP directo:**

```bash
sudo certbot certonly --manual --preferred-challenges dns -d 9citas.com -d www.9citas.com
```

**Certbot te dará instrucciones:**
1. Te mostrará un registro TXT que debes añadir en DNS
2. Añade el registro TXT en Hostinger DNS
3. Espera 1-2 minutos
4. Presiona Enter en la terminal
5. Certbot verificará y obtendrá el certificado

---

## ✅ Solución 3: Verificar si Podemos Acceder Directamente

### Verificar DNS Directo

```bash
# Desde el servidor
dig 9citas.com +short

# Debería mostrar: 84.32.84.32
```

---

### Probar Acceso Directo a la IP

**Desde tu ordenador:**

```bash
# Añadir entrada temporal en /etc/hosts (solo para probar)
# En Mac/Linux: sudo nano /etc/hosts
# Añade: 84.32.84.32 9citas.com

# Luego prueba
curl -I http://9citas.com
```

**Si funciona con la IP directa:** El problema es el CDN.

---

## ✅ Solución 4: Usar Cloudflare (Gratis)

**Si Hostinger no tiene SSL, puedes usar Cloudflare:**

1. **Crea cuenta gratuita en Cloudflare**
2. **Añade tu dominio `9citas.com`**
3. **Cloudflare te dará nameservers**
4. **Cambia los nameservers en Hostinger a los de Cloudflare**
5. **Cloudflare incluye SSL automático y gratuito**

**Ventajas:**
- ✅ SSL automático
- ✅ CDN gratuito
- ✅ Protección DDoS
- ✅ Fácil de configurar

---

## 🔍 Verificar Estado Actual

### Verificar si Certbot Funciona Ahora

```bash
# Intentar Certbot de nuevo
sudo certbot --nginx -d 9citas.com -d www.9citas.com
```

**Si sigue fallando, usa DNS challenge:**

```bash
sudo certbot certonly --manual --preferred-challenges dns -d 9citas.com -d www.9citas.com
```

---

## 📋 Pasos Recomendados

1. **Intentar Certbot normal primero:**
   ```bash
   sudo certbot --nginx -d 9citas.com -d www.9citas.com
   ```

2. **Si falla, usar DNS challenge:**
   ```bash
   sudo certbot certonly --manual --preferred-challenges dns -d 9citas.com -d www.9citas.com
   ```

3. **O usar Cloudflare** (más fácil y con más beneficios)

---

## 🆘 Si Todo Falla

### Contactar con Hostinger

1. **Contacta con el soporte de Hostinger**
2. **Pregunta cómo obtener SSL para tu dominio**
3. **O pregunta cómo deshabilitar el CDN**

---

## ✅ Después de Obtener el Certificado

Una vez que tengas el certificado (de cualquier método), configura Nginx para HTTPS y te ayudo con eso.

