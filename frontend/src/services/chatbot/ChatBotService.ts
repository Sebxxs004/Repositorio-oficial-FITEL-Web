/**
 * ChatBotService
 * 
 * Servicio responsable de procesar las preguntas del usuario y sugerir rutas
 * basadas en palabras clave y contexto.
 */

export interface ChatMessage {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
  suggestions?: RouteSuggestion[]
}

export interface RouteSuggestion {
  label: string
  href: string
  description?: string
}

export class ChatBotService {
  // Mapeo de palabras clave a rutas
  private static readonly KEYWORD_ROUTES: Map<string, RouteSuggestion[]> = new Map([
    ['planes', [
      { label: 'Ver Planes', href: '/planes', description: 'Consulta nuestros planes de Internet y TV' }
    ]],
    ['plan', [
      { label: 'Ver Planes', href: '/planes', description: 'Consulta nuestros planes de Internet y TV' }
    ]],
    ['precio', [
      { label: 'Ver Planes', href: '/planes', description: 'Consulta precios y planes disponibles' }
    ]],
    ['precios', [
      { label: 'Ver Planes', href: '/planes', description: 'Consulta precios y planes disponibles' }
    ]],
    ['tarifa', [
      { label: 'Ver Planes', href: '/planes', description: 'Consulta nuestras tarifas' }
    ]],
    ['tarifas', [
      { label: 'Ver Planes', href: '/planes', description: 'Consulta nuestras tarifas' }
    ]],
    ['internet', [
      { label: 'Ver Planes', href: '/planes', description: 'Planes de Internet disponibles' }
    ]],
    ['television', [
      { label: 'Ver Planes', href: '/planes', description: 'Planes de TV disponibles' }
    ]],
    ['tv', [
      { label: 'Ver Planes', href: '/planes', description: 'Planes de TV disponibles' }
    ]],
    ['cobertura', [
      { label: 'Verificar Cobertura', href: '/cobertura', description: 'Verifica si tenemos cobertura en tu zona' }
    ]],
    ['zona', [
      { label: 'Verificar Cobertura', href: '/cobertura', description: 'Verifica si tenemos cobertura en tu zona' }
    ]],
    ['barrio', [
      { label: 'Verificar Cobertura', href: '/cobertura', description: 'Verifica si tenemos cobertura en tu zona' }
    ]],
    ['direccion', [
      { label: 'Verificar Cobertura', href: '/cobertura', description: 'Verifica si tenemos cobertura en tu dirección' }
    ]],
    ['ubicacion', [
      { label: 'Verificar Cobertura', href: '/cobertura', description: 'Verifica si tenemos cobertura en tu ubicación' }
    ]],
    ['contacto', [
      { label: 'Contacto', href: '/contacto', description: 'Contáctanos directamente' }
    ]],
    ['contactar', [
      { label: 'Contacto', href: '/contacto', description: 'Contáctanos directamente' }
    ]],
    ['hablar', [
      { label: 'Contacto', href: '/contacto', description: 'Contáctanos directamente' }
    ]],
    ['llamar', [
      { label: 'Contacto', href: '/contacto', description: 'Contáctanos directamente' }
    ]],
    ['pqr', [
      { label: 'Realizar PQR', href: '/pqrs/realizar', description: 'Crea una nueva PQR' },
      { label: 'Consultar PQR', href: '/pqrs/consultar', description: 'Consulta el estado de tu PQR' }
    ]],
    ['pqrs', [
      { label: 'Realizar PQR', href: '/pqrs/realizar', description: 'Crea una nueva PQR' },
      { label: 'Consultar PQR', href: '/pqrs/consultar', description: 'Consulta el estado de tu PQR' }
    ]],
    ['queja', [
      { label: 'Realizar PQR', href: '/pqrs/realizar', description: 'Crea una nueva PQR' }
    ]],
    ['quejas', [
      { label: 'Realizar PQR', href: '/pqrs/realizar', description: 'Crea una nueva PQR' }
    ]],
    ['reclamo', [
      { label: 'Realizar PQR', href: '/pqrs/realizar', description: 'Crea una nueva PQR' }
    ]],
    ['reclamos', [
      { label: 'Realizar PQR', href: '/pqrs/realizar', description: 'Crea una nueva PQR' }
    ]],
    ['peticion', [
      { label: 'Realizar PQR', href: '/pqrs/realizar', description: 'Crea una nueva PQR' }
    ]],
    ['peticiones', [
      { label: 'Realizar PQR', href: '/pqrs/realizar', description: 'Crea una nueva PQR' }
    ]],
    ['sugerencia', [
      { label: 'Realizar PQR', href: '/pqrs/realizar', description: 'Crea una nueva PQR' }
    ]],
    ['sugerencias', [
      { label: 'Realizar PQR', href: '/pqrs/realizar', description: 'Crea una nueva PQR' }
    ]],
    ['consultar', [
      { label: 'Consultar PQR', href: '/pqrs/consultar', description: 'Consulta el estado de tu PQR' }
    ]],
    ['estado', [
      { label: 'Consultar PQR', href: '/pqrs/consultar', description: 'Consulta el estado de tu PQR' }
    ]],
    ['informacion', [
      { label: 'Información para Usuarios', href: '/informacion-usuarios', description: 'Información importante para usuarios' }
    ]],
    ['información', [
      { label: 'Información para Usuarios', href: '/informacion-usuarios', description: 'Información importante para usuarios' }
    ]],
    ['usuario', [
      { label: 'Información para Usuarios', href: '/informacion-usuarios', description: 'Información importante para usuarios' }
    ]],
    ['usuarios', [
      { label: 'Información para Usuarios', href: '/informacion-usuarios', description: 'Información importante para usuarios' }
    ]],
    ['terminos', [
      { label: 'Términos y Condiciones', href: '/terminos-condiciones', description: 'Lee nuestros términos y condiciones' }
    ]],
    ['términos', [
      { label: 'Términos y Condiciones', href: '/terminos-condiciones', description: 'Lee nuestros términos y condiciones' }
    ]],
    ['condiciones', [
      { label: 'Términos y Condiciones', href: '/terminos-condiciones', description: 'Lee nuestros términos y condiciones' }
    ]],
    ['privacidad', [
      { label: 'Política de Privacidad', href: '/politica-privacidad', description: 'Conoce nuestra política de privacidad' }
    ]],
    ['politica', [
      { label: 'Política de Privacidad', href: '/politica-privacidad', description: 'Conoce nuestra política de privacidad' }
    ]],
    ['política', [
      { label: 'Política de Privacidad', href: '/politica-privacidad', description: 'Conoce nuestra política de privacidad' }
    ]],
    ['inicio', [
      { label: 'Ir al Inicio', href: '/', description: 'Volver a la página principal' }
    ]],
    ['home', [
      { label: 'Ir al Inicio', href: '/', description: 'Volver a la página principal' }
    ]],
    ['canales', [
      { label: 'Malla de Canales', href: '/malla-canales', description: 'Consulta todos los canales disponibles' },
      { label: 'Información para Usuarios', href: '/informacion-usuarios', description: 'Información importante sobre nuestros servicios' }
    ]],
    ['canal', [
      { label: 'Malla de Canales', href: '/malla-canales', description: 'Consulta todos los canales disponibles' },
      { label: 'Información para Usuarios', href: '/informacion-usuarios', description: 'Información importante sobre nuestros servicios' }
    ]],
    ['malla', [
      { label: 'Malla de Canales', href: '/malla-canales', description: 'Consulta todos los canales disponibles' },
      { label: 'Información para Usuarios', href: '/informacion-usuarios', description: 'Información importante sobre nuestros servicios' }
    ]],
    ['programacion', [
      { label: 'Malla de Canales', href: '/malla-canales', description: 'Consulta la programación de canales' },
      { label: 'Información para Usuarios', href: '/informacion-usuarios', description: 'Información importante sobre nuestros servicios' }
    ]],
    ['programación', [
      { label: 'Malla de Canales', href: '/malla-canales', description: 'Consulta la programación de canales' },
      { label: 'Información para Usuarios', href: '/informacion-usuarios', description: 'Información importante sobre nuestros servicios' }
    ]],
    ['televisión', [
      { label: 'Malla de Canales', href: '/malla-canales', description: 'Consulta todos los canales disponibles' },
      { label: 'Información para Usuarios', href: '/informacion-usuarios', description: 'Información importante sobre nuestros servicios' }
    ]],
    ['television', [
      { label: 'Malla de Canales', href: '/malla-canales', description: 'Consulta todos los canales disponibles' },
      { label: 'Información para Usuarios', href: '/informacion-usuarios', description: 'Información importante sobre nuestros servicios' }
    ]],
    ['servicios', [
      { label: 'Malla de Canales', href: '/malla-canales', description: 'Consulta nuestros canales' },
      { label: 'Ver Planes', href: '/planes', description: 'Consulta nuestros planes' },
      { label: 'Información para Usuarios', href: '/informacion-usuarios', description: 'Información importante sobre nuestros servicios' }
    ]],
    ['deportes', [
      { label: 'Malla de Canales', href: '/malla-canales', description: 'Consulta canales de deportes disponibles' }
    ]],
    ['peliculas', [
      { label: 'Malla de Canales', href: '/malla-canales', description: 'Consulta canales de películas y series' }
    ]],
    ['películas', [
      { label: 'Malla de Canales', href: '/malla-canales', description: 'Consulta canales de películas y series' }
    ]],
    ['series', [
      { label: 'Malla de Canales', href: '/malla-canales', description: 'Consulta canales de series y películas' }
    ]],
    ['infantiles', [
      { label: 'Malla de Canales', href: '/malla-canales', description: 'Consulta canales infantiles disponibles' }
    ]],
    ['niños', [
      { label: 'Malla de Canales', href: '/malla-canales', description: 'Consulta canales para niños' }
    ]],
    ['musica', [
      { label: 'Malla de Canales', href: '/malla-canales', description: 'Consulta canales de música disponibles' }
    ]],
    ['música', [
      { label: 'Malla de Canales', href: '/malla-canales', description: 'Consulta canales de música disponibles' }
    ]],
    ['documentales', [
      { label: 'Malla de Canales', href: '/malla-canales', description: 'Consulta canales de documentales' }
    ]],
    ['speedtest', [
      { label: 'SpeedTest FITEL', href: 'https://fitelcolombia.speedtestcustom.com/', description: 'Mide la velocidad de tu conexión' }
    ]],
    ['speed', [
      { label: 'SpeedTest FITEL', href: 'https://fitelcolombia.speedtestcustom.com/', description: 'Mide la velocidad de tu conexión' }
    ]],
    ['velocidad', [
      { label: 'SpeedTest FITEL', href: 'https://fitelcolombia.speedtestcustom.com/', description: 'Mide la velocidad de tu internet' }
    ]],
    ['velocidades', [
      { label: 'SpeedTest FITEL', href: 'https://fitelcolombia.speedtestcustom.com/', description: 'Mide la velocidad de tu internet' }
    ]],
    ['medir', [
      { label: 'SpeedTest FITEL', href: 'https://fitelcolombia.speedtestcustom.com/', description: 'Mide la velocidad de tu conexión' }
    ]],
    ['lento', [
      { label: 'SpeedTest FITEL', href: 'https://fitelcolombia.speedtestcustom.com/', description: 'Prueba la velocidad de tu internet' },
      { label: 'Realizar PQR', href: '/pqrs/realizar', description: 'Reporta un problema con tu servicio' }
    ]],
    ['lenta', [
      { label: 'SpeedTest FITEL', href: 'https://fitelcolombia.speedtestcustom.com/', description: 'Prueba la velocidad de tu internet' },
      { label: 'Realizar PQR', href: '/pqrs/realizar', description: 'Reporta un problema con tu servicio' }
    ]],
    ['prueba', [
      { label: 'SpeedTest FITEL', href: 'https://fitelcolombia.speedtestcustom.com/', description: 'Prueba la velocidad de tu internet' }
    ]],
    ['test', [
      { label: 'SpeedTest FITEL', href: 'https://fitelcolombia.speedtestcustom.com/', description: 'Mide la velocidad de tu internet' }
    ]],
  ])

  // Saludos y respuestas del bot
  private static readonly GREETINGS = [
    '¡Hola! 👋 Soy tu asistente virtual de FITEL. ¿En qué puedo ayudarte hoy?',
    '¡Bienvenido! 😊 Estoy aquí para ayudarte a encontrar lo que necesitas. ¿Qué buscas?',
    '¡Hola! 🎉 ¿Cómo puedo asistirte hoy?',
  ]

  private static readonly DEFAULT_RESPONSES = [
    'Puedo ayudarte con información sobre nuestros planes, malla de canales, cobertura, contacto, PQRs y más. ¿Qué te gustaría saber?',
    'Estoy aquí para ayudarte. Puedes preguntarme sobre planes, canales disponibles, cobertura, cómo contactarnos o realizar una PQR.',
    'Puedo guiarte a diferentes secciones de nuestro sitio. ¿Qué necesitas?',
  ]

  /**
   * Procesa un mensaje del usuario y genera una respuesta
   */
  static processMessage(userMessage: string): ChatMessage {
    const normalizedMessage = userMessage.toLowerCase().trim()

    // Detectar saludos
    if (this.isGreeting(normalizedMessage)) {
      return {
        id: this.generateId(),
        text: this.getRandomGreeting(),
        isBot: true,
        timestamp: new Date(),
        suggestions: this.getQuickActions(),
      }
    }

    // Detectar despedidas
    if (this.isFarewell(normalizedMessage)) {
      return {
        id: this.generateId(),
        text: '¡Hasta luego! 😊 Si necesitas algo más, no dudes en preguntarme.',
        isBot: true,
        timestamp: new Date(),
      }
    }

    // Buscar rutas basadas en palabras clave
    const suggestions = this.findRouteSuggestions(normalizedMessage)

    if (suggestions.length > 0) {
      return {
        id: this.generateId(),
        text: this.buildResponseForSuggestions(suggestions),
        isBot: true,
        timestamp: new Date(),
        suggestions,
      }
    }

    // Respuesta por defecto
    return {
      id: this.generateId(),
      text: this.getRandomDefaultResponse(),
      isBot: true,
      timestamp: new Date(),
      suggestions: this.getQuickActions(),
    }
  }

  /**
   * Obtiene acciones rápidas para mostrar al usuario
   */
  static getQuickActions(): RouteSuggestion[] {
    return [
      { label: 'Ver Planes', href: '/planes', description: 'Planes de Internet y TV' },
      { label: 'Malla de Canales', href: '/malla-canales', description: 'Consulta todos los canales disponibles' },
      { label: 'Verificar Cobertura', href: '/cobertura', description: 'Consulta si tenemos cobertura en tu zona' },
      { label: 'SpeedTest', href: 'https://fitelcolombia.speedtestcustom.com/', description: 'Mide la velocidad de tu internet' },
      { label: 'Contacto', href: '/contacto', description: 'Contáctanos' },
      { label: 'Realizar PQR', href: '/pqrs/realizar', description: 'Crear una nueva PQR' },
    ]
  }

  /**
   * Verifica si el mensaje es un saludo
   */
  private static isGreeting(message: string): boolean {
    const greetings = ['hola', 'hi', 'hey', 'buenos días', 'buenas tardes', 'buenas noches', 'saludos']
    return greetings.some(greeting => message.includes(greeting))
  }

  /**
   * Verifica si el mensaje es una despedida
   */
  private static isFarewell(message: string): boolean {
    const farewells = ['adiós', 'chao', 'hasta luego', 'nos vemos', 'gracias', 'bye']
    return farewells.some(farewell => message.includes(farewell))
  }

  /**
   * Busca sugerencias de rutas basadas en palabras clave
   */
  private static findRouteSuggestions(message: string): RouteSuggestion[] {
    const suggestions: RouteSuggestion[] = []
    const seenHrefs = new Set<string>()

    for (const [keyword, routes] of this.KEYWORD_ROUTES.entries()) {
      if (message.includes(keyword)) {
        for (const route of routes) {
          if (!seenHrefs.has(route.href)) {
            suggestions.push(route)
            seenHrefs.add(route.href)
          }
        }
      }
    }

    return suggestions
  }

  /**
   * Construye una respuesta basada en las sugerencias encontradas
   */
  private static buildResponseForSuggestions(suggestions: RouteSuggestion[]): string {
    if (suggestions.length === 1) {
      return `¡Perfecto! Te puedo ayudar con eso. Te sugiero visitar: ${suggestions[0].label}. ${suggestions[0].description || ''}`
    }
    if (suggestions.length === 2) {
      // Respuesta especial para canales con información de usuarios
      const hasMallaCanales = suggestions.some(s => s.href === '/malla-canales')
      const hasInfoUsuarios = suggestions.some(s => s.href === '/informacion-usuarios')
      
      if (hasMallaCanales && hasInfoUsuarios) {
        return `Te puedo ayudar con información sobre nuestros canales. Puedes consultar la malla completa de canales disponibles o revisar información importante para usuarios sobre nuestros servicios. ¿Qué prefieres?`
      }
      
      return `Encontré ${suggestions.length} opciones que podrían ayudarte. ¿Cuál te interesa más?`
    }
    return `Encontré varias opciones que podrían ayudarte. ¿Cuál te interesa?`
  }

  /**
   * Obtiene un saludo aleatorio
   */
  static getRandomGreeting(): string {
    return this.GREETINGS[Math.floor(Math.random() * this.GREETINGS.length)]
  }

  /**
   * Obtiene una respuesta por defecto aleatoria
   */
  private static getRandomDefaultResponse(): string {
    return this.DEFAULT_RESPONSES[Math.floor(Math.random() * this.DEFAULT_RESPONSES.length)]
  }

  /**
   * Genera un ID único para los mensajes
   */
  private static generateId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}
