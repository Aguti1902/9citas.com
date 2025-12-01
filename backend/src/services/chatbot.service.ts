import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

interface ChatContext {
  profileName: string
  profileAge: number
  profilePersonality: string
  profileBio: string
  userMessage: string
  conversationHistory?: { role: 'user' | 'assistant'; content: string }[]
}

const personalityPrompts = {
  coqueta: (name: string, age: number) => `Eres ${name}, una mujer de ${age} años coqueta y juguetona. Respondes de forma seductora y con emojis. Te gusta el flirteo y los cumplidos. Mantén las respuestas cortas (2-3 líneas máximo).`,
  
  seria: (name: string, age: number) => `Eres ${name}, una mujer de ${age} años seria y madura. Respondes de forma educada pero directa. Valoras las conversaciones profundas. Mantén las respuestas cortas (2-3 líneas máximo).`,
  
  divertida: (name: string, age: number) => `Eres ${name}, una mujer de ${age} años alegre y divertida. Te encanta bromear y usar emojis. Eres espontánea y simpática. Mantén las respuestas cortas (2-3 líneas máximo).`,
  
  picante: (name: string, age: number) => `Eres ${name}, una mujer de ${age} años atrevida y sensual. Respondes con insinuaciones sutiles pero directas. Te gusta el juego de seducción. Mantén las respuestas cortas (2-3 líneas máximo).`,
  
  romantica: (name: string, age: number) => `Eres ${name}, una mujer de ${age} años romántica y soñadora. Te gustan los detalles y las conversaciones emotivas. Respondes con cariño. Mantén las respuestas cortas (2-3 líneas máximo).`,
}

export async function generateChatbotResponse(context: ChatContext): Promise<string> {
  try {
    const personality = context.profilePersonality || 'divertida'
    
    // Crear prompt base
    const promptFunction = personalityPrompts[personality as keyof typeof personalityPrompts] || personalityPrompts.divertida
    let systemPrompt = promptFunction(context.profileName, context.profileAge)
    
    systemPrompt += `\n\nTu biografía: ${context.profileBio}\n\nIMPORTANTE: Responde SIEMPRE en español. Sé natural, como si estuvieras ligando en una app de citas. NO uses asteriscos ni descripciones de acciones. Solo diálogo directo.`

    const messages: any[] = [
      { role: 'system', content: systemPrompt },
    ]

    // Añadir historial de conversación si existe
    if (context.conversationHistory && context.conversationHistory.length > 0) {
      context.conversationHistory.forEach(msg => {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
        })
      })
    }

    // Añadir mensaje actual
    messages.push({ role: 'user', content: context.userMessage })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.9,
      max_tokens: 150,
    })

    return completion.choices[0]?.message?.content || '😊'
  } catch (error) {
    console.error('Error al generar respuesta de chatbot:', error)
    
    // Respuestas de fallback según personalidad
    const fallbacks: Record<string, string[]> = {
      coqueta: ['Jaja me haces reír 😊', 'Cuéntame más sobre ti 😏', 'Me gustas 💕'],
      seria: ['Interesante punto de vista.', 'Háblame más de eso.', 'Me parece bien.'],
      divertida: ['Jajaja 😂', '¡Qué divertido! 😄', 'Me encanta tu energía 🎉'],
      picante: ['Mmm... me gusta eso 🔥', 'Sigue así 😈', 'Me estás tentando... 💋'],
      romantica: ['Qué bonito lo que dices 💖', 'Me haces sonreír ☺️', 'Eres muy especial 💕'],
    }
    
    const personality = context.profilePersonality || 'divertida'
    const responses = fallbacks[personality] || fallbacks.divertida
    return responses[Math.floor(Math.random() * responses.length)]
  }
}

export async function shouldBotRespond(isFake: boolean, lastMessageTime?: Date): Promise<boolean> {
  if (!isFake) return false
  
  // Responder entre 5 y 30 segundos después del último mensaje
  const randomDelay = Math.floor(Math.random() * 25000) + 5000
  
  if (lastMessageTime) {
    const timeSinceLastMessage = Date.now() - lastMessageTime.getTime()
    return timeSinceLastMessage >= randomDelay
  }
  
  return true
}

