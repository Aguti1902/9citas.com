# 🤖 Configurar OpenAI para el Chatbot

## ✅ Estado Actual

El chatbot **YA ESTÁ INTEGRADO** en el código. Solo necesitas configurar la API key.

## 📋 Pasos para Activar el Chatbot

### 1. Obtener API Key de OpenAI

1. Ve a: https://platform.openai.com/api-keys
2. Inicia sesión o crea una cuenta
3. Haz clic en "Create new secret key"
4. Copia la API key (empieza con `sk-...`)

### 2. Configurar en Railway (Producción)

1. Ve a tu proyecto en Railway: https://railway.app
2. Selecciona tu servicio de backend
3. Ve a la pestaña "Variables"
4. Añade una nueva variable:
   - **Nombre**: `OPENAI_API_KEY`
   - **Valor**: `sk-tu-api-key-aqui`
5. Guarda y reinicia el servicio

### 3. Configurar Localmente (Desarrollo)

Añade la variable al archivo `.env`:

```bash
OPENAI_API_KEY=sk-tu-api-key-aqui
```

## 🎯 Cómo Funciona

Cuando un usuario envía un mensaje a un **perfil falso**:

1. El sistema detecta que es un perfil falso (`isFake: true`)
2. Espera entre 5-20 segundos (simula tiempo de respuesta)
3. Genera una respuesta usando ChatGPT con la personalidad del perfil
4. Envía la respuesta automáticamente

## 🎭 Personalidades Disponibles

Cada perfil falso tiene una personalidad:

- **coqueta**: Responden de forma seductora y juguetona
- **seria**: Responden de forma educada pero directa
- **divertida**: Responden con bromas y emojis
- **picante**: Responden con insinuaciones sutiles
- **romantica**: Responden con cariño y detalles

## 💰 Costos de OpenAI

- **Modelo usado**: `gpt-4o-mini` (el más económico)
- **Costo aproximado**: ~$0.15 por 1M tokens
- **Cada mensaje**: ~50-150 tokens
- **Costo por 1000 mensajes**: ~$0.01 - $0.02

## 🔍 Verificar que Funciona

1. Inicia sesión en la app
2. Busca un perfil falso (mujer, hetero)
3. Envía un mensaje
4. Espera 5-20 segundos
5. Deberías recibir una respuesta automática

## ⚠️ Troubleshooting

**Error: "Must supply api_key"**
- Verifica que `OPENAI_API_KEY` esté en las variables de entorno
- Reinicia el servidor después de añadir la variable

**No responde el chatbot**
- Verifica los logs del backend
- Asegúrate de que el perfil tenga `isFake: true` y `personality` definida

**Respuestas genéricas**
- Verifica que el perfil tenga `aboutMe` y `personality` configurados

## 📝 Notas

- El chatbot solo funciona con perfiles falsos (`isFake: true`)
- Las respuestas se generan en español
- El historial de conversación se mantiene (últimos 10 mensajes)
- Si falla OpenAI, se usan respuestas de fallback según la personalidad

