/**
 * TerminosCondiciones Component
 * 
 * Componente que muestra los términos y condiciones de FITEL
 */

'use client'

import { FileText, Shield, CheckCircle, AlertCircle, Clock, Users } from 'lucide-react'
import Link from 'next/link'
import { FITEL_EMAIL, FITEL_PHONE_DISPLAY, FITEL_PHONE_TEL } from '@/config/constants'

export function TerminosCondiciones() {
  // Usar una fecha estática para evitar errores de hidratación
  // La fecha se puede actualizar manualmente cuando sea necesario
  const currentYear = new Date().getFullYear()
  const lastUpdateDate = new Date().toLocaleDateString('es-CO', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <FileText className="w-8 h-8 text-primary-red" />
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-dark">
            Términos y Condiciones
          </h1>
        </div>
        <p className="text-lg text-neutral-gray max-w-2xl mx-auto">
          Conoce los términos y condiciones que rigen el uso de nuestros servicios de Internet y Televisión.
        </p>
        <p className="text-sm text-neutral-gray mt-2" suppressHydrationWarning>
          Última actualización: {lastUpdateDate}
        </p>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Introducción */}
        <section className="bg-neutral-white rounded-xl shadow-lg p-6 md:p-8 border border-neutral-gray-light">
          <div className="flex items-start gap-4 mb-4">
            <Shield className="w-6 h-6 text-primary-red flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-neutral-dark mb-3">
                Introducción
              </h2>
              <p className="text-neutral-gray leading-relaxed">
                Bienvenido a FITEL. Estos términos y condiciones establecen las reglas y regulaciones 
                para el uso de nuestros servicios de Internet y Televisión. Al contratar nuestros servicios, 
                usted acepta cumplir con estos términos en su totalidad.
              </p>
            </div>
          </div>
        </section>

        {/* Definiciones */}
        <section className="bg-neutral-white rounded-xl shadow-lg p-6 md:p-8 border border-neutral-gray-light">
          <h2 className="text-2xl font-bold text-neutral-dark mb-4 flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary-red" />
            1. Definiciones
          </h2>
          <div className="space-y-3 text-neutral-gray">
            <p>
              <strong className="text-neutral-dark">FITEL:</strong> Empresa proveedora de servicios 
              de Internet y Televisión con sede en Bogotá, Colombia.
            </p>
            <p>
              <strong className="text-neutral-dark">Usuario/Cliente:</strong> Persona natural o jurídica 
              que contrata y utiliza los servicios de FITEL.
            </p>
            <p>
              <strong className="text-neutral-dark">Servicios:</strong> Incluyen servicios de conexión 
              a Internet, televisión por cable/satélite, y cualquier otro servicio ofrecido por FITEL.
            </p>
            <p>
              <strong className="text-neutral-dark">Contrato:</strong> Acuerdo entre FITEL y el Usuario 
              para la prestación de servicios.
            </p>
          </div>
        </section>

        {/* Servicios */}
        <section className="bg-neutral-white rounded-xl shadow-lg p-6 md:p-8 border border-neutral-gray-light">
          <h2 className="text-2xl font-bold text-neutral-dark mb-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-primary-red" />
            2. Descripción de los Servicios
          </h2>
          <div className="space-y-4 text-neutral-gray">
            <p>
              FITEL ofrece servicios de Internet de banda ancha y televisión por suscripción en la 
              ciudad de Bogotá y áreas de cobertura autorizadas.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> La disponibilidad de servicios está sujeta a la cobertura 
                técnica en su zona. Puede verificar la cobertura en nuestra sección de 
                <Link href="/cobertura" className="text-primary-red hover:underline mx-1">
                  Cobertura
                </Link>
                o contactarnos directamente.
              </p>
            </div>
          </div>
        </section>

        {/* Contratación */}
        <section className="bg-neutral-white rounded-xl shadow-lg p-6 md:p-8 border border-neutral-gray-light">
          <h2 className="text-2xl font-bold text-neutral-dark mb-4 flex items-center gap-3">
            <Users className="w-6 h-6 text-primary-red" />
            3. Contratación y Activación
          </h2>
          <div className="space-y-4 text-neutral-gray">
            <div>
              <h3 className="font-semibold text-neutral-dark mb-2">3.1 Requisitos para la Contratación</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Ser mayor de edad o contar con representante legal</li>
                <li>Presentar documento de identidad válido</li>
                <li>Comprobante de residencia en zona de cobertura</li>
                <li>Aceptar estos términos y condiciones</li>
                <li>Firmar el contrato de prestación de servicios</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-dark mb-2">3.2 Activación del Servicio</h3>
              <p>
                El servicio será activado una vez completada la instalación técnica y el pago de 
                los costos de instalación y primera facturación, según corresponda.
              </p>
            </div>
          </div>
        </section>

        {/* Obligaciones */}
        <section className="bg-neutral-white rounded-xl shadow-lg p-6 md:p-8 border border-neutral-gray-light">
          <h2 className="text-2xl font-bold text-neutral-dark mb-4 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-primary-red" />
            4. Obligaciones de las Partes
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-neutral-dark mb-2">4.1 Obligaciones de FITEL</h3>
              <ul className="list-disc list-inside space-y-2 text-neutral-gray ml-4">
                <li>Prestar los servicios contratados con la calidad acordada</li>
                <li>Mantener la confidencialidad de los datos del usuario</li>
                <li>Proporcionar soporte técnico cuando sea necesario</li>
                <li>Informar sobre cambios en los servicios o tarifas con antelación</li>
                <li>Cumplir con los tiempos de respuesta establecidos en los SLA</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-dark mb-2">4.2 Obligaciones del Usuario</h3>
              <ul className="list-disc list-inside space-y-2 text-neutral-gray ml-4">
                <li>Realizar el pago oportuno de las facturas mensuales</li>
                <li>Usar el servicio de manera responsable y legal</li>
                <li>No compartir la conexión con terceros sin autorización</li>
                <li>Mantener en buen estado el equipo instalado</li>
                <li>Notificar cambios de dirección o datos de contacto</li>
                <li>No realizar actividades ilegales a través del servicio</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Facturación y Pagos */}
        <section className="bg-neutral-white rounded-xl shadow-lg p-6 md:p-8 border border-neutral-gray-light">
          <h2 className="text-2xl font-bold text-neutral-dark mb-4 flex items-center gap-3">
            <Clock className="w-6 h-6 text-primary-red" />
            5. Facturación y Pagos
          </h2>
          <div className="space-y-4 text-neutral-gray">
            <div>
              <h3 className="font-semibold text-neutral-dark mb-2">5.1 Facturación</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>La facturación es mensual y se emite el primer día de cada mes</li>
                <li>El período de facturación corresponde al mes calendario anterior</li>
                <li>Las facturas se envían por correo electrónico o se entregan físicamente</li>
                <li>El usuario puede solicitar facturación electrónica o física</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-dark mb-2">5.2 Formas de Pago</h3>
              <p className="mb-2">FITEL acepta los siguientes métodos de pago:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Pago en línea a través del portal de clientes</li>
                <li>Transferencia bancaria</li>
                <li>Pago en puntos físicos autorizados</li>
                <li>Débito automático</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-dark mb-2">5.3 Vencimiento y Mora</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>El pago debe realizarse dentro de los 15 días siguientes a la emisión de la factura</li>
                <li>El incumplimiento en el pago puede resultar en la suspensión del servicio</li>
                <li>Se aplicarán intereses de mora según la normativa vigente</li>
                <li>La reactivación del servicio puede requerir el pago de costos adicionales</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Uso del Servicio */}
        <section className="bg-neutral-white rounded-xl shadow-lg p-6 md:p-8 border border-neutral-gray-light">
          <h2 className="text-2xl font-bold text-neutral-dark mb-4">
            6. Uso Aceptable del Servicio
          </h2>
          <div className="space-y-4 text-neutral-gray">
            <p>
              El usuario se compromete a utilizar el servicio de manera responsable y legal. 
              Está prohibido:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Realizar actividades ilegales o que violen derechos de terceros</li>
              <li>Transmitir contenido malicioso, virus o spam</li>
              <li>Intentar acceder no autorizado a sistemas o redes</li>
              <li>Compartir la conexión con terceros sin autorización expresa</li>
              <li>Usar el servicio para actividades comerciales no autorizadas</li>
              <li>Realizar ingeniería inversa o modificar el equipo proporcionado</li>
            </ul>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-red-800">
                <strong>Importante:</strong> El incumplimiento de estas normas puede resultar en 
                la terminación inmediata del servicio sin derecho a reembolso.
              </p>
            </div>
          </div>
        </section>

        {/* Suspensión y Terminación */}
        <section className="bg-neutral-white rounded-xl shadow-lg p-6 md:p-8 border border-neutral-gray-light">
          <h2 className="text-2xl font-bold text-neutral-dark mb-4">
            7. Suspensión y Terminación del Servicio
          </h2>
          <div className="space-y-4 text-neutral-gray">
            <div>
              <h3 className="font-semibold text-neutral-dark mb-2">7.1 Suspensión</h3>
              <p>
                FITEL puede suspender el servicio en caso de incumplimiento de pago, uso indebido 
                del servicio, o por razones técnicas necesarias para el mantenimiento.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-dark mb-2">7.2 Terminación</h3>
              <p>
                Cualquiera de las partes puede terminar el contrato con previo aviso de 30 días. 
                El usuario debe cancelar cualquier saldo pendiente y devolver el equipo proporcionado 
                en buen estado.
              </p>
            </div>
          </div>
        </section>

        {/* Limitación de Responsabilidad */}
        <section className="bg-neutral-white rounded-xl shadow-lg p-6 md:p-8 border border-neutral-gray-light">
          <h2 className="text-2xl font-bold text-neutral-dark mb-4">
            8. Limitación de Responsabilidad
          </h2>
          <div className="space-y-4 text-neutral-gray">
            <p>
              FITEL no será responsable por daños indirectos, pérdida de datos, o interrupciones 
              del servicio causadas por factores fuera de su control, incluyendo pero no limitado a:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Fallas en la infraestructura de terceros</li>
              <li>Desastres naturales o eventos de fuerza mayor</li>
              <li>Actos de autoridades gubernamentales</li>
              <li>Interrupciones por mantenimiento programado</li>
              <li>Uso indebido del servicio por parte del usuario</li>
            </ul>
          </div>
        </section>

        {/* Protección de Datos */}
        <section className="bg-neutral-white rounded-xl shadow-lg p-6 md:p-8 border border-neutral-gray-light">
          <h2 className="text-2xl font-bold text-neutral-dark mb-4">
            9. Protección de Datos Personales
          </h2>
          <div className="space-y-4 text-neutral-gray">
            <p>
              FITEL cumple con la Ley 1581 de 2012 y el Decreto 1377 de 2013 sobre protección de 
              datos personales. Los datos del usuario serán tratados con confidencialidad y solo 
              serán utilizados para los fines relacionados con la prestación del servicio.
            </p>
            <p>
              Para más información sobre el tratamiento de datos personales, consulte nuestra 
              <Link href="/politica-privacidad" className="text-primary-red hover:underline mx-1">
                Política de Privacidad
              </Link>.
            </p>
          </div>
        </section>

        {/* Modificaciones */}
        <section className="bg-neutral-white rounded-xl shadow-lg p-6 md:p-8 border border-neutral-gray-light">
          <h2 className="text-2xl font-bold text-neutral-dark mb-4">
            10. Modificaciones a los Términos
          </h2>
          <div className="space-y-4 text-neutral-gray">
            <p>
              FITEL se reserva el derecho de modificar estos términos y condiciones. Los cambios 
              serán notificados con al menos 30 días de antelación a través de correo electrónico 
              o notificación en la factura.
            </p>
            <p>
              El uso continuado del servicio después de la notificación de cambios constituye 
              la aceptación de los nuevos términos.
            </p>
          </div>
        </section>

        {/* Contacto y Reclamos */}
        <section className="bg-neutral-white rounded-xl shadow-lg p-6 md:p-8 border border-neutral-gray-light">
          <h2 className="text-2xl font-bold text-neutral-dark mb-4">
            11. Contacto y Reclamos
          </h2>
          <div className="space-y-4 text-neutral-gray">
            <p>
              Para cualquier consulta, reclamo o solicitud relacionada con estos términos y condiciones, 
              puede contactarnos a través de:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-neutral-gray-light rounded-lg p-4">
                <p className="font-semibold text-neutral-dark mb-1">Teléfono</p>
                <a href={FITEL_PHONE_TEL} className="text-primary-red hover:underline">
                  {FITEL_PHONE_DISPLAY}
                </a>
              </div>
              <div className="bg-neutral-gray-light rounded-lg p-4">
                <p className="font-semibold text-neutral-dark mb-1">Email</p>
                <a href={`mailto:${FITEL_EMAIL}`} className="text-primary-red hover:underline">
                  {FITEL_EMAIL}
                </a>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-blue-800">
                También puede presentar una PQR (Petición, Queja o Recurso) a través de nuestro 
                sistema en línea. Visite nuestra sección de 
                <Link href="/pqrs/realizar" className="text-primary-red hover:underline mx-1">
                  PQRs
                </Link>
                para más información.
              </p>
            </div>
          </div>
        </section>

        {/* Ley Aplicable */}
        <section className="bg-neutral-white rounded-xl shadow-lg p-6 md:p-8 border border-neutral-gray-light">
          <h2 className="text-2xl font-bold text-neutral-dark mb-4">
            12. Ley Aplicable y Jurisdicción
          </h2>
          <div className="space-y-4 text-neutral-gray">
            <p>
              Estos términos y condiciones se rigen por las leyes de la República de Colombia. 
              Cualquier disputa será resuelta en los tribunales competentes de Bogotá, Colombia.
            </p>
            <p>
              Las partes se comprometen a intentar resolver cualquier controversia mediante 
              negociación directa antes de acudir a instancias judiciales.
            </p>
          </div>
        </section>

        {/* Aceptación */}
        <section className="bg-gradient-to-r from-primary-red to-primary-red/80 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Aceptación de los Términos
          </h2>
          <p className="text-center text-white/90 mb-6">
            Al contratar nuestros servicios, usted confirma que ha leído, entendido y acepta 
            estos términos y condiciones en su totalidad.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contacto"
              className="px-6 py-3 bg-white text-primary-red rounded-lg hover:bg-neutral-gray-light transition-colors font-semibold"
            >
              Contactar Soporte
            </Link>
            <Link
              href="/informacion-usuarios"
              className="px-6 py-3 bg-white text-primary-red rounded-lg hover:bg-neutral-gray-light transition-colors font-semibold"
            >
              Información para Usuarios
            </Link>
          </div>
        </section>

        {/* Footer del documento */}
        <div className="text-center text-neutral-gray text-sm pt-8 border-t border-neutral-gray-light">
          <p>
            © {currentYear} FITEL. Todos los derechos reservados.
          </p>
          <p className="mt-2">
            Documento legal - Versión 1.0
          </p>
        </div>
      </div>
    </div>
  )
}
