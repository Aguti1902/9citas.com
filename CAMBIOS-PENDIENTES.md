# ✅ CAMBIOS COMPLETADOS

## 1. ✅ Roam requiere 9Plus
- Si no tienes 9Plus y haces click en Roam, salta el modal premium

## 2. ✅ Super Like eliminado
- Botón de estrella azul quitado de las cards
- Solo quedan: X (pasar) y ❤️ (me gusta)

## 3. ✅ Filtros ajustados
- **PREMIUM (⭐)**: ONLINE y EDAD
- **GRATIS**: TODOS, DISTANCIA, NUEVOS, RECIENTES

---

# 📋 PENDIENTES (Requieren más trabajo)

## 4. ⏳ Chat restringido para usuarios free
**Lógica a implementar:**
- **Usuarios FREE**: Solo pueden chatear si AMBOS se han dado like (match mutuo)
- **Usuarios 9PLUS**: Pueden chatear con solo dar like

**Archivos a modificar:**
- `backend/src/controllers/message.controller.ts`: Verificar match mutuo
- `frontend/src/pages/ProfileDetailPage.tsx`: Mostrar botón de chat solo si hay match (o si es 9Plus)
- `frontend/src/pages/InboxPage.tsx`: Filtrar conversaciones según plan

## 5. ⏳ PWA - Añadir a pantalla de inicio
**Lo que se necesita:**
- Crear `manifest.json` con configuración PWA
- Añadir botón/banner "Añadir a inicio" en la app
- Configurar service worker (opcional)

**Archivos a crear:**
- `frontend/public/manifest.json`
- Componente para detectar si puede instalarse

## 6. ⏳ Filtro de edad con rango "desde-hasta"
**Actualmente:** Solo permite seleccionar rango completo (18-99)
**Necesario:** Permitir modificar AMBOS valores independientemente

**Archivo a modificar:**
- `frontend/src/components/common/FilterBar.tsx`: Ya tiene RangeSlider, solo necesita permitir modificar ambos extremos

---

# 🎯 PRÓXIMOS PASOS SUGERIDOS

1. **Chat restringido** (PRIORITARIO)
   - Es la funcionalidad más crítica
   - Afecta modelo de negocio (free vs premium)

2. **PWA** (MEDIO)
   - Mejora experiencia de usuario
   - Hace la web parecer app nativa

3. **Filtro edad mejorado** (BAJO)
   - Ya funciona, solo necesita mejora UX

¿Por cuál empiezo?

