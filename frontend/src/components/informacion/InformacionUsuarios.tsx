/**
 * InformacionUsuarios Component
 * 
 * Componente que muestra información útil para los usuarios de FITEL
 */

'use client'

import { 
  FileText, 
  CreditCard, 
  Wifi, 
  Phone, 
  Mail, 
  HelpCircle, 
  Shield, 
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  FileCheck,
  Users,
  Settings
} from 'lucide-react'
import Link from 'next/link'
import { FITEL_PHONE_DISPLAY, FITEL_PHONE_TEL, FITEL_EMAIL, FITEL_WHATSAPP_URL } from '@/config/constants'

interface InfoSection {
  id: string
  title: string
  icon: React.ReactNode
  renderContent: () => React.ReactNode
}

export function InformacionUsuarios() {
  const sections: InfoSection[] = [
    {
      id: 'contratacion',
      title: 'Contratación de Servicios',
      icon: <FileText className="w-6 h-6" />,
      renderContent: () => (
        <div className="space-y-4">
          <p className="text-neutral-gray">
            En FITEL ofrecemos servicios de Internet y Televisión de alta calidad en Bogotá. 
            Para contratar nuestros servicios, puedes:
          </p>
          <ul className="space-y-2 list-disc list-inside text-neutral-gray">
            <li>Contactarnos por teléfono o WhatsApp</li>
            <li>Visitar nuestra página de contacto y completar el formulario</li>
            <li>Solicitar una visita técnica para evaluar la cobertura en tu zona</li>
          </ul>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Nuestro equipo de ventas te ayudará a elegir el plan 
              que mejor se adapte a tus necesidades.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'pagos',
      title: 'Formas de Pago',
      icon: <CreditCard className="w-6 h-6" />,
      renderContent: () => (
        <div className="space-y-4">
          <p className="text-neutral-gray">
            En FITEL ofrecemos múltiples formas de pago para tu comodidad:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-neutral-white border border-neutral-gray-light rounded-lg p-4">
              <h4 className="font-semibold text-neutral-dark mb-2">Pago en Línea</h4>
              <p className="text-sm text-neutral-gray">
                Accede a nuestro portal de clientes y paga desde la comodidad de tu hogar.
              </p>
            </div>
            <div className="bg-neutral-white border border-neutral-gray-light rounded-lg p-4">
              <h4 className="font-semibold text-neutral-dark mb-2">Pago en Punto Físico</h4>
              <p className="text-sm text-neutral-gray">
                Visita nuestras oficinas o puntos de pago autorizados.
              </p>
            </div>
            <div className="bg-neutral-white border border-neutral-gray-light rounded-lg p-4">
              <h4 className="font-semibold text-neutral-dark mb-2">Transferencia Bancaria</h4>
              <p className="text-sm text-neutral-gray">
                Realiza transferencias desde tu banco usando el número de referencia de tu factura.
              </p>
            </div>
            <div className="bg-neutral-white border border-neutral-gray-light rounded-lg p-4">
              <h4 className="font-semibold text-neutral-dark mb-2">Débito Automático</h4>
              <p className="text-sm text-neutral-gray">
                Configura el débito automático para que tu factura se pague automáticamente cada mes.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'facturacion',
      title: 'Facturación',
      icon: <FileCheck className="w-6 h-6" />,
      renderContent: () => (
        <div className="space-y-4">
          <p className="text-neutral-gray">
            Información importante sobre tu facturación:
          </p>
          <ul className="space-y-2 list-disc list-inside text-neutral-gray">
            <li>Las facturas se emiten mensualmente</li>
            <li>Recibirás tu factura por correo electrónico o en físico según tu preferencia</li>
            <li>El período de facturación es del día 1 al último día del mes</li>
            <li>La fecha de vencimiento es 15 días después de la emisión</li>
          </ul>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-amber-800">
              <strong>Importante:</strong> El pago oportuno de tu factura garantiza la continuidad 
              del servicio sin interrupciones.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'soporte',
      title: 'Soporte Técnico',
      icon: <Settings className="w-6 h-6" />,
      renderContent: () => (
        <div className="space-y-4">
          <p className="text-neutral-gray">
            Si experimentas problemas con tu servicio, nuestro equipo de soporte técnico está disponible para ayudarte:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-neutral-white border border-neutral-gray-light rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-5 h-5 text-primary-red" />
                <h4 className="font-semibold text-neutral-dark">Por Teléfono</h4>
              </div>
              <p className="text-sm text-neutral-gray">
                Llámanos al número de atención al cliente para reportar problemas técnicos.
              </p>
            </div>
            <div className="bg-neutral-white border border-neutral-gray-light rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-5 h-5 text-primary-red" />
                <h4 className="font-semibold text-neutral-dark">Por WhatsApp</h4>
              </div>
              <p className="text-sm text-neutral-gray">
                Escríbenos por WhatsApp para atención rápida y personalizada.
              </p>
            </div>
            <div className="bg-neutral-white border border-neutral-gray-light rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-5 h-5 text-primary-red" />
                <h4 className="font-semibold text-neutral-dark">Por Email</h4>
              </div>
              <p className="text-sm text-neutral-gray">
                Envía un correo detallando el problema y te responderemos a la brevedad.
              </p>
            </div>
            <div className="bg-neutral-white border border-neutral-gray-light rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-primary-red" />
                <Link href="/contacto">
                  <h4 className="font-semibold text-neutral-dark hover:text-primary-red transition-colors">Formulario Web</h4>
                </Link>
              </div>
              <p className="text-sm text-neutral-gray">
                Completa nuestro formulario de contacto para solicitar soporte técnico.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'pqr',
      title: 'Peticiones, Quejas y Recursos (PQR)',
      icon: <MessageSquare className="w-6 h-6" />,
      renderContent: () => (
        <div className="space-y-4">
          <p className="text-neutral-gray">
            En FITEL nos comprometemos a resolver tus inquietudes de manera oportuna y eficiente. 
            Puedes presentar una PQR cuando:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-neutral-white border border-neutral-gray-light rounded-lg p-4">
              <h4 className="font-semibold text-neutral-dark mb-2">Petición</h4>
              <p className="text-sm text-neutral-gray">
                Solicitudes de información, servicios o documentos.
              </p>
            </div>
            <div className="bg-neutral-white border border-neutral-gray-light rounded-lg p-4">
              <h4 className="font-semibold text-neutral-dark mb-2">Queja</h4>
              <p className="text-sm text-neutral-gray">
                Manifestaciones de inconformidad con nuestros servicios o atención.
              </p>
            </div>
            <div className="bg-neutral-white border border-neutral-gray-light rounded-lg p-4">
              <h4 className="font-semibold text-neutral-dark mb-2">Recurso</h4>
              <p className="text-sm text-neutral-gray">
                Impugnaciones a decisiones tomadas sobre tu PQR.
              </p>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-green-800">
              <strong>Tiempo de Respuesta:</strong> Nos comprometemos a responder tu PQR en un plazo 
              máximo de 15 días hábiles según lo establecido en la normativa vigente.
            </p>
          </div>
          <div className="flex gap-4 mt-4">
            <Link 
              href="/pqrs/realizar"
              className="px-6 py-3 bg-primary-red text-white rounded-lg hover:bg-primary-red/90 transition-colors font-semibold"
            >
              Realizar una PQR
            </Link>
            <Link 
              href="/pqrs/consultar"
              className="px-6 py-3 bg-neutral-dark text-white rounded-lg hover:bg-neutral-dark/90 transition-colors font-semibold"
            >
              Consultar mi PQR
            </Link>
          </div>
        </div>
      )
    },
    {
      id: 'derechos',
      title: 'Derechos de los Usuarios',
      icon: <Shield className="w-6 h-6" />,
      renderContent: () => (
        <div className="space-y-4">
          <p className="text-neutral-gray">
            Como usuario de FITEL, tienes derecho a:
          </p>
          <ul className="space-y-3 list-none text-neutral-gray">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Recibir información clara y veraz sobre nuestros servicios y tarifas</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Acceder a un servicio de calidad sin interrupciones injustificadas</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Presentar PQRs y recibir respuesta oportuna</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Protección de tus datos personales según la normativa vigente</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Cancelar el servicio cuando lo desees, cumpliendo con los términos contractuales</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Recibir atención y soporte técnico cuando lo necesites</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'preguntas',
      title: 'Preguntas Frecuentes',
      icon: <HelpCircle className="w-6 h-6" />,
      renderContent: () => (
        <div className="space-y-6">
          <div className="bg-neutral-white border border-neutral-gray-light rounded-lg p-4">
            <h4 className="font-semibold text-neutral-dark mb-2">
              ¿Cómo puedo verificar la cobertura en mi zona?
            </h4>
            <p className="text-sm text-neutral-gray">
              Puedes usar nuestro mapa de cobertura en la sección "Cobertura" o contactarnos 
              directamente para una evaluación personalizada.
            </p>
          </div>
          <div className="bg-neutral-white border border-neutral-gray-light rounded-lg p-4">
            <h4 className="font-semibold text-neutral-dark mb-2">
              ¿Qué hago si mi servicio se interrumpe?
            </h4>
            <p className="text-sm text-neutral-gray">
              Contacta inmediatamente a nuestro soporte técnico. Nuestro equipo trabajará para 
              resolver el problema lo antes posible.
            </p>
          </div>
          <div className="bg-neutral-white border border-neutral-gray-light rounded-lg p-4">
            <h4 className="font-semibold text-neutral-dark mb-2">
              ¿Puedo cambiar de plan en cualquier momento?
            </h4>
            <p className="text-sm text-neutral-gray">
              Sí, puedes cambiar de plan contactando a nuestro equipo de atención al cliente. 
              Los cambios se aplicarán en el siguiente ciclo de facturación.
            </p>
          </div>
          <div className="bg-neutral-white border border-neutral-gray-light rounded-lg p-4">
            <h4 className="font-semibold text-neutral-dark mb-2">
              ¿Cómo puedo consultar el estado de mi PQR?
            </h4>
            <p className="text-sm text-neutral-gray">
              Puedes consultar el estado de tu PQR ingresando tu CUN (Código Único Numérico) 
              o número de documento en nuestra sección de consulta de PQRs.
            </p>
          </div>
          <div className="bg-neutral-white border border-neutral-gray-light rounded-lg p-4">
            <h4 className="font-semibold text-neutral-dark mb-2">
              ¿Qué información necesito para contratar el servicio?
            </h4>
            <p className="text-sm text-neutral-gray">
              Necesitarás tu documento de identidad, comprobante de residencia y datos de contacto. 
              Nuestro equipo te guiará en todo el proceso.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'contacto',
      title: 'Información de Contacto',
      icon: <Phone className="w-6 h-6" />,
      renderContent: () => (
        <div className="space-y-4">
          <p className="text-neutral-gray">
            Estamos aquí para ayudarte. Contáctanos por cualquiera de estos medios:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-neutral-white border border-neutral-gray-light rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Phone className="w-5 h-5 text-primary-red" />
                <h4 className="font-semibold text-neutral-dark">Teléfono</h4>
              </div>
              <a href={FITEL_PHONE_TEL} className="text-primary-red hover:underline">
                {FITEL_PHONE_DISPLAY}
              </a>
            </div>
            <div className="bg-neutral-white border border-neutral-gray-light rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-5 h-5 text-primary-red" />
                <h4 className="font-semibold text-neutral-dark">Email</h4>
              </div>
              <a href={`mailto:${FITEL_EMAIL}`} className="text-primary-red hover:underline">
                {FITEL_EMAIL}
              </a>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              href="/contacto"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-red text-white rounded-lg hover:bg-primary-red/90 transition-colors font-semibold"
            >
              <MessageSquare className="w-5 h-5" />
              Ir a la página de contacto
            </Link>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-dark mb-4">
          Información para Usuarios
        </h1>
        <p className="text-lg text-neutral-gray max-w-2xl mx-auto">
          Encuentra toda la información que necesitas sobre nuestros servicios, 
          formas de pago, soporte técnico y más.
        </p>
      </div>

      {/* Secciones de información */}
      <div className="space-y-8">
        {sections.map((section, index) => (
          <div
            key={section.id}
            id={section.id}
            className="bg-neutral-white rounded-xl shadow-lg p-6 md:p-8 border border-neutral-gray-light"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-primary-red/10 rounded-lg text-primary-red">
                {section.icon}
              </div>
              <h2 className="text-2xl font-bold text-neutral-dark">
                {section.title}
              </h2>
            </div>
            <div className="text-neutral-dark">
              {section.renderContent()}
            </div>
          </div>
        ))}
      </div>

      {/* Navegación rápida */}
      <div className="mt-12 bg-gradient-to-r from-primary-red to-primary-red/80 rounded-xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-4 text-center">
          ¿Necesitas ayuda adicional?
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/contacto"
            className="px-6 py-3 bg-white text-primary-red rounded-lg hover:bg-neutral-gray-light transition-colors font-semibold"
          >
            Contactar Soporte
          </Link>
          <Link
            href="/pqrs/realizar"
            className="px-6 py-3 bg-white text-primary-red rounded-lg hover:bg-neutral-gray-light transition-colors font-semibold"
          >
            Realizar una PQR
          </Link>
          <Link
            href="/pqrs/consultar"
            className="px-6 py-3 bg-white text-primary-red rounded-lg hover:bg-neutral-gray-light transition-colors font-semibold"
          >
            Consultar mi PQR
          </Link>
        </div>
      </div>
    </div>
  )
}
