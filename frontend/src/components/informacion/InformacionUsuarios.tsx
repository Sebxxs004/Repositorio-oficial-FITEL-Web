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
  Settings,
  Zap,
  Monitor,
  Globe,
  Router,
  Signal,
  Cpu,
  CloudOff,
  Wrench,
  BarChart2,
  Info,
  Network
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
      id: 'factores-limitacion',
      title: 'Factores de limitación de la velocidad de Internet',
      icon: <Zap className="w-6 h-6" />,
      renderContent: () => (
        <div className="space-y-6">
          <p className="text-neutral-gray">
            La velocidad de Internet que experimenta un usuario puede ser inferior a la velocidad 
            contratada por múltiples razones técnicas. A continuación detallamos los principales 
            factores, diferenciando los que dependen del operador FITEL de los que dependen del 
            usuario o de terceros.
          </p>

          {/* Factores del operador */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 flex items-center justify-center bg-primary-red/10 rounded-lg text-primary-red flex-shrink-0">
                <Signal className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-neutral-dark">
                Factores propios de la red FITEL
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                <h4 className="font-semibold text-neutral-dark mb-2 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-primary-red" />
                  Tecnología de acceso
                </h4>
                <p className="text-sm text-neutral-gray">
                  FITEL utiliza tecnología de fibra óptica (FTTH) y tecnología inalámbrica fija (FWA). 
                  La velocidad máxima alcanzable depende del tipo de conexión disponible en tu zona.
                </p>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                <h4 className="font-semibold text-neutral-dark mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary-red" />
                  Congestión en horas pico
                </h4>
                <p className="text-sm text-neutral-gray">
                  En horas de mayor demanda (7–10 p.m.), la red puede experimentar congestiones 
                  que reducen temporalmente la velocidad efectiva. Gestionamos el tráfico para 
                  garantizar el mínimo garantizado de tu plan.
                </p>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                <h4 className="font-semibold text-neutral-dark mb-2 flex items-center gap-2">
                  <CloudOff className="w-4 h-4 text-primary-red" />
                  Mantenimientos programados
                </h4>
                <p className="text-sm text-neutral-gray">
                  Las labores de mantenimiento preventivo o correctivo pueden generar 
                  interrupciones parciales o totales del servicio. Notificamos con anticipación 
                  cuando es posible.
                </p>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                <h4 className="font-semibold text-neutral-dark mb-2 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-primary-red" />
                  Calidad del cableado de última milla
                </h4>
                <p className="text-sm text-neutral-gray">
                  El estado del cableado desde el nodo de distribución hasta tu domicilio 
                  puede afectar la velocidad. FITEL realiza revisiones periódicas de su infraestructura.
                </p>
              </div>
            </div>
          </div>

          {/* Factores del usuario */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-lg text-blue-600 flex-shrink-0">
                <Router className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-neutral-dark">
                Factores en la red interna del usuario
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <h4 className="font-semibold text-neutral-dark mb-2 flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-blue-600" />
                  Conexión WiFi vs. cable
                </h4>
                <p className="text-sm text-neutral-gray">
                  Una conexión por cable Ethernet siempre entrega velocidades superiores al WiFi. 
                  El WiFi pierde eficiencia por distancia, paredes, interferencias y el estándar 
                  del router (WiFi 4/5/6).
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <h4 className="font-semibold text-neutral-dark mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  Número de dispositivos conectados
                </h4>
                <p className="text-sm text-neutral-gray">
                  Con múltiples dispositivos conectados simultáneamente, el ancho de banda contratado 
                  se distribuye entre todos ellos, reduciendo la velocidad disponible para cada uno.
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <h4 className="font-semibold text-neutral-dark mb-2 flex items-center gap-2">
                  <Signal className="w-4 h-4 text-blue-600" />
                  Interferencias de señal WiFi
                </h4>
                <p className="text-sm text-neutral-gray">
                  Otros routers de vecinos, dispositivos como hornos microondas, teléfonos 
                  inalámbricos y paredes gruesas generan interferencias que reducen la calidad 
                  de la señal WiFi.
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <h4 className="font-semibold text-neutral-dark mb-2 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-blue-600" />
                  Estado del router / módem
                </h4>
                <p className="text-sm text-neutral-gray">
                  Un router con firmware desactualizado, sobrecalentado, con muchos años de uso 
                  o con configuración incorrecta puede limitar significativamente el rendimiento 
                  de la conexión.
                </p>
              </div>
            </div>
          </div>

          {/* Factores del dispositivo final */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-lg text-green-600 flex-shrink-0">
                <Monitor className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-neutral-dark">
                Factores del dispositivo del usuario
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                <h4 className="font-semibold text-neutral-dark mb-2 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-green-600" />
                  Capacidad del dispositivo
                </h4>
                <p className="text-sm text-neutral-gray">
                  La velocidad de procesamiento de la tarjeta de red, el procesador y la RAM 
                  del computador o celular determinan la velocidad máxima que el dispositivo 
                  puede procesar, independientemente del plan contratado.
                </p>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                <h4 className="font-semibold text-neutral-dark mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  Software y seguridad
                </h4>
                <p className="text-sm text-neutral-gray">
                  El uso de VPNs, antivirus con inspección de tráfico, virus o malware activo 
                  en el dispositivo puede reducir considerablemente la velocidad de navegación.
                </p>
              </div>
            </div>
          </div>

          {/* Factores externos */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 flex items-center justify-center bg-yellow-100 rounded-lg text-yellow-600 flex-shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-neutral-dark">
                Factores externos (ajenos al operador)
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                <h4 className="font-semibold text-neutral-dark mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-yellow-600" />
                  Capacidad del servidor destino
                </h4>
                <p className="text-sm text-neutral-gray">
                  Si el sitio web, plataforma de streaming o juego en línea al que accedes tiene 
                  limitaciones en sus propios servidores, la velocidad percibida será menor, 
                  aunque tu conexión funcione correctamente.
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                <h4 className="font-semibold text-neutral-dark mb-2 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-yellow-600" />
                  Cableado interno del inmueble
                </h4>
                <p className="text-sm text-neutral-gray">
                  El estado del cableado físico dentro del apartamento o casa (responsabilidad 
                  del propietario del inmueble) puede afectar la calidad de la señal entregada 
                  por FITEL al punto final.
                </p>
              </div>
            </div>
          </div>

          {/* Tip box */}
          <div className="bg-neutral-dark rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold mb-1">Consejo: cómo medir tu velocidad real</p>
                <p className="text-white/80 text-sm">
                  Para medir la velocidad real de tu conexión, conecta tu dispositivo directamente 
                  al router por cable Ethernet y usa nuestra herramienta oficial{' '}
                  <a 
                    href="https://fitelcolombia.speedtestcustom.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-400 hover:underline font-semibold"
                  >
                    SpeedTest FITEL
                  </a>. 
                  Si la velocidad medida es inferior al 70% de tu plan contratado, contáctanos.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'indicadores-calidad',
      title: 'Indicadores de calidad del servicio de Internet',
      icon: <BarChart2 className="w-6 h-6" />,
      renderContent: () => (
        <div className="space-y-6">
          <p className="text-neutral-gray">
            La Comisión de Regulación de Comunicaciones (CRC) establece los indicadores mínimos
            de calidad que todo proveedor de internet en Colombia debe cumplir (Resolución CRC 5110 de 2017
            y modificatorias). A continuación encontrarás qué significa cada indicador, cuál es el
            mínimo legal exigido y cómo puedes medirlo tú mismo.
          </p>

          {/* Aviso de transparencia */}
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-800 mb-1">Transparencia sobre nuestros datos</p>
              <p className="text-sm text-blue-700">
                FITEL publica los parámetros mínimos regulatorios garantizados. Si tienes dudas sobre
                el desempeño específico de tu conexión, puedes medirlo con las herramientas indicadas
                más abajo o solicitarnos un reporte técnico a través de una PQR.
              </p>
            </div>
          </div>

          {/* Indicadores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Velocidad */}
            <div className="bg-neutral-white border border-neutral-gray-light rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center bg-primary-red/10 rounded-lg text-primary-red">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-neutral-dark">Velocidad efectiva</h3>
              </div>
              <p className="text-sm text-neutral-gray">
                Es la velocidad real de descarga y carga que llega a tu dispositivo. Puede diferir
                de la velocidad nominal del plan por los factores descritos en la sección anterior.
              </p>
              <div className="bg-green-50 rounded-lg px-4 py-2 text-sm">
                <span className="font-semibold text-green-800">Mínimo regulatorio: </span>
                <span className="text-green-700">≥ 40% de la velocidad contratada para descarga; ≥ 20% para carga (CRC).</span>
              </div>
              <p className="text-xs text-neutral-gray">
                Ejemplo: si tienes un plan de 100 Mbps, la velocidad mínima garantizada es de 40 Mbps de bajada.
              </p>
            </div>

            {/* Latencia */}
            <div className="bg-neutral-white border border-neutral-gray-light rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center bg-secondary-blue/10 rounded-lg text-secondary-blue">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-neutral-dark">Latencia (ping)</h3>
              </div>
              <p className="text-sm text-neutral-gray">
                Es el tiempo que tarda un paquete de datos en ir desde tu dispositivo hasta el servidor
                y volver. Afecta directamente videollamadas, videojuegos y aplicaciones en tiempo real.
              </p>
              <div className="bg-green-50 rounded-lg px-4 py-2 text-sm">
                <span className="font-semibold text-green-800">Mínimo regulatorio: </span>
                <span className="text-green-700">≤ 150 ms en condiciones normales de red (CRC).</span>
              </div>
              <p className="text-xs text-neutral-gray">
                Un valor de 10–40 ms es excelente; 40–100 ms es aceptable; más de 150 ms se considera
                degradación del servicio.
              </p>
            </div>

            {/* Jitter */}
            <div className="bg-neutral-white border border-neutral-gray-light rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center bg-purple-100 rounded-lg text-purple-600">
                  <Signal className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-neutral-dark">Jitter (variación de latencia)</h3>
              </div>
              <p className="text-sm text-neutral-gray">
                Mide la variabilidad en los tiempos de entrega de los paquetes. Un jitter alto provoca
                cortes en videollamadas, tartamudeo en streaming y problemas en VoIP.
              </p>
              <div className="bg-green-50 rounded-lg px-4 py-2 text-sm">
                <span className="font-semibold text-green-800">Mínimo regulatorio: </span>
                <span className="text-green-700">≤ 50 ms (CRC).</span>
              </div>
              <p className="text-xs text-neutral-gray">
                Valores de jitter menores a 20 ms son ideales para videollamadas y streaming de alta calidad.
              </p>
            </div>

            {/* Pérdida de paquetes */}
            <div className="bg-neutral-white border border-neutral-gray-light rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center bg-orange-100 rounded-lg text-orange-500">
                  <CloudOff className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-neutral-dark">Pérdida de paquetes</h3>
              </div>
              <p className="text-sm text-neutral-gray">
                Porcentaje de paquetes de datos que no llegan a su destino. Una pérdida alta provoca
                recargas de página, congelamiento de video y errores de conexión.
              </p>
              <div className="bg-green-50 rounded-lg px-4 py-2 text-sm">
                <span className="font-semibold text-green-800">Mínimo regulatorio: </span>
                <span className="text-green-700">≤ 3% de pérdida de paquetes (CRC).</span>
              </div>
              <p className="text-xs text-neutral-gray">
                Lo ideal es 0%. Valores por encima del 3% indican un problema que debe reportarse
                mediante PQR o llamando a soporte técnico.
              </p>
            </div>

            {/* Disponibilidad */}
            <div className="bg-neutral-white border border-neutral-gray-light rounded-xl p-5 space-y-3 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center bg-green-100 rounded-lg text-green-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-neutral-dark">Disponibilidad del servicio</h3>
              </div>
              <p className="text-sm text-neutral-gray">
                Porcentaje del tiempo en que el servicio está efectivamente activo y funcional durante
                un período medido (generalmente mensual). Incluye todas las interrupciones no programadas.
              </p>
              <div className="bg-green-50 rounded-lg px-4 py-2 text-sm">
                <span className="font-semibold text-green-800">Mínimo regulatorio: </span>
                <span className="text-green-700">≥ 95% de disponibilidad mensual (CRC). Esto equivale a un máximo de ~36 horas de interrupción por mes.</span>
              </div>
              <p className="text-xs text-neutral-gray">
                El tiempo de inactividad por mantenimientos programados y notificados previamente no
                se conta como interrupción del servicio según la regulación colombiana.
              </p>
            </div>
          </div>

          {/* Cómo medir */}
          <div className="bg-neutral-dark rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Wrench className="w-5 h-5 text-yellow-400" />
              <h3 className="font-bold text-white">¿Cómo mido estos indicadores?</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a
                href="https://fitelcolombia.speedtestcustom.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center bg-white/10 hover:bg-white/20 transition-colors rounded-lg p-4 text-center"
              >
                <Zap className="w-7 h-7 text-yellow-400 mb-2" />
                <span className="text-white font-semibold text-sm">SpeedTest FITEL</span>
                <span className="text-white/60 text-xs mt-1">Velocidad, latencia y jitter</span>
              </a>
              <a
                href="https://www.speedtest.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center bg-white/10 hover:bg-white/20 transition-colors rounded-lg p-4 text-center"
              >
                <Globe className="w-7 h-7 text-blue-300 mb-2" />
                <span className="text-white font-semibold text-sm">Speedtest by Ookla</span>
                <span className="text-white/60 text-xs mt-1">Estándar internacional</span>
              </a>
              <a
                href="https://fast.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center bg-white/10 hover:bg-white/20 transition-colors rounded-lg p-4 text-center"
              >
                <Monitor className="w-7 h-7 text-green-300 mb-2" />
                <span className="text-white font-semibold text-sm">Fast.com</span>
                <span className="text-white/60 text-xs mt-1">Medición de velocidad Netflix</span>
              </a>
            </div>
            <p className="text-white/60 text-xs pt-1">
              Para una medición precisa, conecta tu dispositivo al router por cable Ethernet y cierra
              todas las aplicaciones que consuman datos antes de realizar la prueba.
            </p>
          </div>

          {/* Qué hacer si no cumple */}
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <AlertCircle className="w-5 h-5 text-primary-red flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800 mb-1">¿Tu conexión no cumple los mínimos?</p>
              <p className="text-sm text-red-700 mb-2">
                Si la medición de tu velocidad está por debajo del 40% de tu plan contratado, o si
                experimentas latencia mayor a 150 ms de forma constante, tienes derecho a:
              </p>
              <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                <li>Solicitar una revisión técnica sin costo adicional.</li>
                <li>Presentar una PQR exigiendo la corrección del servicio.</li>
                <li>Exigir descuento proporcional por el tiempo de degradación comprobada.</li>
              </ul>
              <Link
                href="/pqrs/realizar"
                className="inline-flex items-center gap-2 mt-3 text-sm font-semibold text-primary-red hover:underline"
              >
                <FileCheck className="w-4 h-4" />
                Presentar una PQR ahora
              </Link>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'practicas-trafico',
      title: 'Prácticas de gestión de tráfico',
      icon: <Network className="w-6 h-6" />,
      renderContent: () => (
        <div className="space-y-6">
          <p className="text-neutral-gray">
            La gestión de tráfico son las técnicas que FITEL aplica sobre su red para garantizar
            una experiencia de calidad a todos los usuarios. Esta sección describe de forma
            transparente qué hacemos y qué no hacemos con el tráfico de datos de nuestros clientes,
            en cumplimiento del principio de <strong>neutralidad de red</strong> (CRC Resolución
            3067 de 2011 y modificatorias).
          </p>

          {/* Neutralidad de red — destacado */}
          <div className="bg-gradient-to-r from-primary-red/10 to-secondary-blue/10 border border-primary-red/20 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-primary-red flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-neutral-dark mb-1">Neutralidad de red</p>
                <p className="text-sm text-neutral-gray">
                  FITEL respeta el principio de neutralidad de red. <strong>No bloqueamos,
                  degradamos ni priorizamos</strong> contenidos, aplicaciones o servicios de
                  forma discriminatoria por razones comerciales. Todo el tráfico legal de
                  Internet es tratado de forma equitativa.
                </p>
              </div>
            </div>
          </div>

          {/* Lo que SÍ hacemos */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-lg text-green-600 flex-shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-neutral-dark">Prácticas que aplicamos</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-neutral-white border border-neutral-gray-light rounded-xl p-4 space-y-2">
                <h4 className="font-semibold text-neutral-dark flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  Gestión de congestión en horas pico
                </h4>
                <p className="text-sm text-neutral-gray">
                  Durante períodos de alta demanda (principalmente 7–10 p.m.), aplicamos técnicas
                  de <em>traffic shaping</em> para distribuir el ancho de banda disponible de
                  forma equitativa entre todos los usuarios activos, evitando que unos pocos
                  saturen la red en perjuicio de los demás.
                </p>
              </div>
              <div className="bg-neutral-white border border-neutral-gray-light rounded-xl p-4 space-y-2">
                <h4 className="font-semibold text-neutral-dark flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-600" />
                  Priorización QoS para tráfico en tiempo real
                </h4>
                <p className="text-sm text-neutral-gray">
                  Aplicamos reglas de Calidad de Servicio (QoS) para priorizar el tráfico
                  sensible a latencia: videollamadas, VoIP y videoconferencias. Esto garantiza
                  que estas aplicaciones no se degraden durante congestiones de red.
                </p>
              </div>
              <div className="bg-neutral-white border border-neutral-gray-light rounded-xl p-4 space-y-2">
                <h4 className="font-semibold text-neutral-dark flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  Filtrado de tráfico malicioso
                </h4>
                <p className="text-sm text-neutral-gray">
                  Bloqueamos activamente el tráfico asociado a amenazas de seguridad conocidas:
                  ataques DDoS, spam masivo, botnets y malware. Este filtrado protege tanto
                  la integridad de la red como la seguridad de los propios usuarios.
                </p>
              </div>
              <div className="bg-neutral-white border border-neutral-gray-light rounded-xl p-4 space-y-2">
                <h4 className="font-semibold text-neutral-dark flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-green-600" />
                  Monitoreo de disponibilidad
                </h4>
                <p className="text-sm text-neutral-gray">
                  Monitoreamos continuamente el estado de nuestra red para detectar y atender
                  fallas de forma proactiva. Cuando detectamos una interrupción antes de que
                  los usuarios la reporten, iniciamos el proceso de restauración de inmediato.
                </p>
              </div>
            </div>
          </div>

          {/* Lo que NO hacemos */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 flex items-center justify-center bg-red-100 rounded-lg text-primary-red flex-shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-neutral-dark">Lo que FITEL no hace</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 space-y-1">
                <p className="font-semibold text-neutral-dark text-sm">❌ No bloqueamos contenidos</p>
                <p className="text-xs text-neutral-gray">
                  No bloqueamos ningún sitio web, aplicación o servicio legal, sin importar
                  si es de un competidor o de cualquier otro proveedor.
                </p>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 space-y-1">
                <p className="font-semibold text-neutral-dark text-sm">❌ No throttling comercial</p>
                <p className="text-xs text-neutral-gray">
                  No reducimos deliberadamente la velocidad de plataformas específicas
                  (Netflix, YouTube, WhatsApp, etc.) para favorecer servicios propios o
                  de terceros pagantes.
                </p>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 space-y-1">
                <p className="font-semibold text-neutral-dark text-sm">❌ No priorizamos por pago</p>
                <p className="text-xs text-neutral-gray">
                  No ofrecemos trato preferencial en la red a ningún proveedor de contenido
                  o aplicación a cambio de contraprestación económica.
                </p>
              </div>
            </div>
          </div>

          {/* Marco regulatorio */}
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-800 mb-1">Marco regulatorio</p>
              <p className="text-sm text-blue-700">
                Las prácticas de gestión de tráfico de FITEL se rigen por la{' '}
                <strong>Resolución CRC 3067 de 2011</strong> (neutralidad de red),
                la <strong>Circular SIC 005 de 2022</strong> y demás normas de la Comisión
                de Regulación de Comunicaciones (CRC). Si consideras que alguna práctica
                viola tus derechos como usuario, puedes presentar una PQR ante FITEL o
                una queja ante la CRC o la SIC.
              </p>
              <Link
                href="/pqrs/realizar"
                className="inline-flex items-center gap-2 mt-3 text-sm font-semibold text-blue-700 hover:underline"
              >
                <FileCheck className="w-4 h-4" />
                Presentar una PQR
              </Link>
            </div>
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
