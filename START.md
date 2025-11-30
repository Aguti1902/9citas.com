# 🚀 CÓMO INICIAR 9CITAS - GUÍA ULTRA SIMPLE

## PASO 1: Asegúrate que PostgreSQL está corriendo

```bash
# Opción A: Iniciar PostgreSQL
pg_ctl -D /usr/local/var/postgresql@14 start

# Opción B: Si lo anterior no funciona
postgres -D /usr/local/var/postgresql@14
# (Deja esta terminal abierta)

# Verificar que funciona
pg_isready
# Debe decir: "accepting connections"
```

## PASO 2: Ejecutar el script de instalación

```bash
cd /Users/guti/Desktop/CURSOR\ WEBS/9CITAS
./install-and-run.sh
```

Este script hace TODO automáticamente:
- ✅ Crea la base de datos
- ✅ Instala todas las dependencias
- ✅ Configura backend y frontend
- ✅ Genera 200-400 perfiles falsos
- ✅ Inicia la aplicación

## PASO 3: Abrir en el navegador

Una vez que veas este mensaje:
```
Backend:  http://localhost:4000
Frontend: http://localhost:3000
```

Abre tu navegador en: **http://localhost:3000**

---

## ⚠️ Si el script no funciona

Ejecuta paso a paso:

```bash
# 1. Asegúrate de estar en la carpeta correcta
cd /Users/guti/Desktop/CURSOR\ WEBS/9CITAS

# 2. Verificar PostgreSQL
pg_isready

# 3. Crear base de datos
createdb 9citas

# 4. Instalar dependencias
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 5. Configurar backend
cd backend
npx prisma generate
npx prisma db push
npm run db:seed
mkdir -p uploads

# 6. Iniciar
cd ..
npm run dev
```

---

## 🆘 PROBLEMAS COMUNES

### "Puerto ocupado"
```bash
lsof -ti:3000 | xargs kill -9
lsof -ti:4000 | xargs kill -9
```

### "PostgreSQL no conecta"
```bash
pg_ctl -D /usr/local/var/postgresql@14 start
```

### "Prisma error"
```bash
cd backend
npx prisma generate
npx prisma db push
```

### La página no carga
1. Verifica que ambos procesos están corriendo (backend y frontend)
2. Abre http://localhost:3000 en tu navegador
3. Revisa la consola del navegador (F12) para ver errores

---

## 📱 URLS

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000
- **Panel Admin:** http://localhost:3000/admin (password: admin123)

---

¿TODAVÍA NO FUNCIONA? Dime:
1. ¿Qué comando ejecutaste?
2. ¿Qué error aparece en la terminal?
3. ¿Qué ves al abrir http://localhost:3000?
