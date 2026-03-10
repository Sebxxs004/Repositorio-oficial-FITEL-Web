import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'leaflet/dist/leaflet.css'
import { Header } from '@/components/layout/Header'
import { FITEL_WHATSAPP_URL, FITEL_PHONE_NUMBER } from '@/config/constants'
import { Footer } from '@/components/layout/Footer'
import { AdminRouteHandler } from '@/components/admin/AdminRouteHandler'
import { ChatBotWrapper } from '@/components/chatbot/ChatBotWrapper'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'FITEL - Uniendo Familias | Internet y TV en Bogotá',
  description: 'FITEL ofrece servicios de Internet y Televisión de alta calidad en Bogotá. Planes para hogares y pequeñas empresas. Consulta cobertura y solicita tu instalación.',
  keywords: 'Internet Bogotá, TV Bogotá, FITEL, servicios de internet, televisión, planes internet',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

async function getWhatsAppUrl(): Promise<string> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
    const res = await fetch(`${apiUrl}/config/contact`, { next: { revalidate: 60 } })
    if (!res.ok) return FITEL_WHATSAPP_URL
    const data = await res.json()
    if (data?.phone) return `https://wa.me/${data.phone}`
    return FITEL_WHATSAPP_URL
  } catch {
    return FITEL_WHATSAPP_URL
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const whatsappUrl = await getWhatsAppUrl()
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen bg-neutral-white antialiased">
        <AdminRouteHandler />
        <Header whatsappUrl={whatsappUrl} />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* ChatBot envuelto para ocultarse en login y rutas de administración */}
        <ChatBotWrapper />
      </body>
    </html>
  )
}
