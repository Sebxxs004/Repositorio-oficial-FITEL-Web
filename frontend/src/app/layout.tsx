import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'leaflet/dist/leaflet.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AdminRouteHandler } from '@/components/admin/AdminRouteHandler'
import { ChatBot } from '@/components/chatbot/ChatBot'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen bg-neutral-white antialiased">
        <AdminRouteHandler />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatBot />
      </body>
    </html>
  )
}
