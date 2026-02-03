'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Send, MessageCircle, ChevronRight } from 'lucide-react'
import { ChatBotService, ChatMessage, RouteSuggestion } from '@/services/chatbot/ChatBotService'

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Evitar problemas de hidratación - solo renderizar en el cliente
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Mensaje inicial cuando se abre el chat
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        text: ChatBotService.getRandomGreeting(),
        isBot: true,
        timestamp: new Date(),
        suggestions: ChatBotService.getQuickActions(),
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, messages.length])

  // Auto-scroll al final de los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus en el input cuando se abre el chat
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const handleSendMessage = () => {
    if (!inputValue.trim() || isTyping) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: inputValue.trim(),
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simular delay de respuesta del bot
    setTimeout(() => {
      const botResponse = ChatBotService.processMessage(userMessage.text)
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSuggestionClick = (suggestion: RouteSuggestion) => {
    // Cerrar el chat cuando se hace clic en una sugerencia
    setIsOpen(false)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
  }

  // No renderizar hasta que esté montado en el cliente para evitar errores de hidratación
  if (!isMounted) {
    return null
  }

  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-0 right-0 z-50 transition-all duration-300 group cursor-pointer flex flex-col items-end"
          aria-label="Abrir chat de asistencia"
        >
          {/* Burbuja de chat */}
          <div 
            className="bg-white rounded-2xl px-4 py-2.5 shadow-xl border border-neutral-gray-light animate-pulse group-hover:animate-none transition-all duration-300 relative -mb-20 md:-mb-24"
            style={{ 
              left: '-20px',
              bottom: '5px',
              transform: 'translateX(0)'
            }}
          >
            <p className="text-sm font-semibold text-neutral-dark whitespace-nowrap">
              ¿Necesitas ayuda? Click aquí!
            </p>
            {/* Cola de la burbuja apuntando hacia abajo */}
            <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-white border-r border-b border-neutral-gray-light"></div>
          </div>
          
          {/* Personaje - solo la imagen sin fondo */}
          <div className="relative w-56 h-56 md:w-64 md:h-64 transform hover:scale-105 transition-transform duration-300 flex items-end">
            <Image
              src="/assets/fitel-mascota.png"
              alt="Asistente FITEL"
              width={256}
              height={256}
              className="object-contain object-bottom drop-shadow-2xl transition-all duration-300"
              style={{ 
                filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.3))',
                objectPosition: 'center bottom'
              }}
            />
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-2xl flex flex-col max-h-[calc(100vh-8rem)] border border-neutral-gray-light">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-red to-primary-red-dark text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/assets/fitel-mascota.png"
                  alt="Asistente FITEL"
                  width={40}
                  height={40}
                  className="object-contain rounded-full bg-white p-1"
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-bold text-lg">Asistente FITEL</h3>
                <p className="text-xs text-white/90">En línea</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-full p-1 transition-colors"
              aria-label="Cerrar chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-gray-light/30">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isBot
                      ? 'bg-white text-neutral-dark shadow-sm'
                      : 'bg-primary-red text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.isBot ? 'text-neutral-gray' : 'text-white/80'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.suggestions.map((suggestion, index) => (
                        <Link
                          key={index}
                          href={suggestion.href}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block bg-primary-red/10 hover:bg-primary-red/20 text-primary-red rounded-md p-2 text-sm transition-colors border border-primary-red/20"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">{suggestion.label}</p>
                              {suggestion.description && (
                                <p className="text-xs text-neutral-gray mt-0.5">
                                  {suggestion.description}
                                </p>
                              )}
                            </div>
                            <ChevronRight className="w-4 h-4 flex-shrink-0" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-neutral-dark rounded-lg p-3 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-neutral-gray rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-neutral-gray rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-neutral-gray rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-neutral-gray-light bg-white rounded-b-lg">
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu pregunta..."
                className="flex-1 px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-primary-red hover:bg-primary-red-dark text-white rounded-lg p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Enviar mensaje"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-neutral-gray mt-2 text-center">
              Escribe palabras como: planes, cobertura, contacto, PQR
            </p>
          </div>
        </div>
      )}
    </>
  )
}
