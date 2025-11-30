# 🚀 INICIO RÁPIDO DE 9CITAS.COM

## ✅ LO QUE YA HICE:

1. **Logo** ✓
   - El logo está copiado en `frontend/public/logo.png`
   - Se mostrará automáticamente en la aplicación

2. **Procesos iniciados** ✓
   - Se abrieron 2 terminales:
     - Una con el BACKEND (debería estar en el puerto 4000)
     - Otra con el FRONTEND (puerto 3000)

## ⚠️ PROBLEMA DETECTADO:

- El **BACKEND** no está iniciando correctamente (no responde en puerto 4000)
- El **FRONTEND** está corriendo bien en el puerto 3000

## 🔍 CÓMO VERIFICAR QUÉ PASA:

1. **Revisa las terminales que se abrieron**:
   - Busca la terminal que dice "🔧 Iniciando BACKEND..."
   - ¿Hay algún error en rojo?
   - ¿Dice "Server corriendo en http://localhost:4000"?

2. **Errores comunes**:
   - Error de importación
   - Error de compilación de TypeScript
   - Error de conexión a base de datos
   - Puerto 4000 ocupado

## 🛠️ SOLUCIONES:

### Opción 1: Reiniciar todo
```bash
cd /Users/guti/Desktop/CURSOR\ WEBS/9CITAS
bash START.sh
```

### Opción 2: Iniciar backend manualmente con logs visibles
```bash
cd /Users/guti/Desktop/CURSOR\ WEBS/9CITAS/backend
npm run dev
```

Esto te mostrará exactamente qué error hay.

### Opción 3: Verificar que la base de datos funciona
```bash
cd /Users/guti/Desktop/CURSOR\ WEBS/9CITAS/backend
npx prisma db push
npx prisma db seed
```

## 📋 VERIFICACIÓN:

Una vez que el backend esté corriendo, verifica:

1. **Backend** (debe responder):
   ```bash
   curl http://localhost:4000/api/health
   ```
   Debería devolver: `{"status":"ok","message":"9citas API is running"}`

2. **Frontend**: 
   - Abre: http://localhost:3000
   - Deberías ver el logo "9citas.com" y los botones de edad/orientación

3. **Base de datos**:
   ```bash
   psql -d 9citas -c "SELECT COUNT(*) FROM profiles;"
   ```

## 🆘 SI NADA FUNCIONA:

Mira el error EXACTO en la terminal del backend y dime qué dice. 
Probablemente sea uno de estos:

1. `Cannot find module ...` → Instalar dependencias: `cd backend && npm install`
2. `Port 4000 is already in use` → Matar proceso: `lsof -ti:4000 | xargs kill -9`
3. `Can't reach database` → Iniciar PostgreSQL: `pg_ctl -D /opt/homebrew/var/postgresql@14 start`
4. Error de TypeScript → Ver qué archivo tiene el problema

## 📝 PRÓXIMOS PASOS DESPUÉS DE ARREGLARLO:

1. Ir a http://localhost:3000
2. Hacer click en "Tengo 18 años y busco citas con heteros" o "gays"
3. Registrarte con un email y contraseña
4. Completar el perfil
5. ¡Empezar a usar la app!

---

**TIP**: El logo ya está configurado. Una vez que el backend funcione, todo debería estar listo.

