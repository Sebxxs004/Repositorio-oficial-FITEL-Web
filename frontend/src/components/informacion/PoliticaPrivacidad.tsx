/**
 * PoliticaPrivacidad Component
 * 
 * Componente que muestra la política de privacidad y protección de datos de FITEL
 */

'use client'

import { Shield, Lock, Eye, FileCheck, AlertCircle, CheckCircle, Database, UserCheck } from 'lucide-react'
import Link from 'next/link'
import { FITEL_EMAIL, FITEL_PHONE_DISPLAY, FITEL_PHONE_TEL } from '@/config/constants'

export function PoliticaPrivacidad() {
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
          <Shield className="w-8 h-8 text-primary-red" />
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-dark">
            Política de Privacidad
          </h1>
        </div>
        <p className="text-lg text-neutral-gray max-w-2xl mx-auto">
          Conoce cómo FITEL protege y trata tu información personal de acuerdo con la normativa 
          colombiana de protección de datos.
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
            <Lock className="w-6 h-6 text-primary-red flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-neutral-dark mb-3">
                Introducción
              </h2>
              <p className="text-neutral-gray leading-relaxed">
                FITEL se compromete a proteger la privacidad y los datos personales de nuestros 
                usuarios. Esta política describe cómo recopilamos, usamos, almacenamos y protegemos 
                su información personal de acuerdo con la Ley 1581 de 2012 y el Decreto 1377 de 2013 
                de Colombia.
              </p>
            </div>
          </div>
        </section>

        {/* Marco Legal */}
        <section className="bg-neutral-white rounded-xl shadow-lg p-6 md:p-8 border border-neutral-gray-light">
          <h2 className="text-2xl font-bold text-neutral-dark mb-4 flex items-center gap-3">
            <FileCheck className="w-6 h-6 text-primary-red" />
            1. Marco Legal
          </h2>
          <div className="space-y-3 text-neutral-gray">
            <p>
              Esta política se rige por las siguientes normas colombianas:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-neutral-dark">Ley 1581 de 2012:</strong> Por la cual se dictan disposiciones generales para la protección de datos personales</li>
              <li><strong className="text-neutral-dark">Decreto 1377 de 2013:</strong> Reglamentación parcial de la Ley 1581 de 2012</li>
              <li><strong className="text-neutral-dark">Decreto 1074 de 2015:</strong> Decreto Único Reglamentario del Sector Comercio, Industria y Turismo</li>
              <li><strong className="text-neutral-dark">Circular Externa 002 de 2015:</strong> De la Superintendencia de Industria y Comercio</li>
            </ul>
          </div>
        </section>

        {/* Responsable del Tratamiento */}
        <section className="bg-neutral-white rounded-xl shadow-lg p-6 md:p-8 border border-neutral-gray-light">
          <h2 className="text-2xl font-bold text-neutral-dark mb-4 flex items-center gap-3">
            <UserCheck className="w-6 h-6 text-primary-red" />
            2. Responsable del Tratamiento
          </h2>
          <div className="space-y-4 text-neutral-gray">
            <p>
              <strong className="text-neutral-dark">Razón Social:</strong> FITEL
            </p>
            <p>
              <strong className="text-neutral-dark">NIT:</strong> [Número de identificación tributaria]
            </p>
            <p>
              <strong className="text-neutral-dark">Dirección:</strong> Bogotá, Colombia
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
          </div>
        </section>

        {/* Datos que Recopilamos */}
        <section className="bg-neutral-white rounded-xl shadow-lg p-6 md:p-8 border border-neutral-gray-light">
          <h2 className="text-2xl font-bold text-neutral-dark mb-4 flex items-center gap-3">
            <Database className="w-6 h-6 text-primary-red" />
            3. Datos Personales que Recopilamos
          </h2>
          <div className="space-y-4 text-neutral-gray">
            <div>
              <h3 className="font-semibold text-neutral-dark mb-2">3.1 Datos de Identificación</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Nombres y apellidos</li>
                <li>Número de documento de identidad (CC, CE, NIT, etc.)</li>
                <li>Fecha de nacimiento</li>
                <li>Nacionalidad</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-dark mb-2">3.2 Datos de Contacto</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Dirección de residencia</li>
                <li>Número de teléfono fijo y móvil</li>
                <li>Dirección de correo electrónico</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-dark mb-2">3.3 Datos Financieros</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Información de facturación</li>
                <li>Historial de pagos</li>
                <li>Datos bancarios (solo si se configura débito automático)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-dark mb-2">3.4 Datos Técnicos</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Dirección IP</li>
                <li>Información del dispositivo</li>
                <li>Registros de uso del servicio</li>
                <li>Datos de geolocalización (para verificación de cobertura)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Finalidad del Tratamiento */}
        <section className="bg-neutral-white rounded-xl shadow-lg p-6 md:p-8 border border-neutral-gray-light">
          <h2 className="text-2xl font-bold text-neutral-dark mb-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-primary-red" />
            4. Finalidad del Tratamiento
          </h2>
          <div className="space-y-4 text-neutral-gray">
            <p>
              Los datos personales son tratados para las siguientes finalidades:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Prestar y administrar los servicios de Internet y Televisión contratados</li>
              <li>Procesar pagos y gestionar la facturación</li>
              <li>Brindar soporte técnico y atención al cliente</li>
              <li>Enviar comunicaciones relacionadas con el servicio (facturas, notificaciones, etc.)</li>
              <li>Cumplir con obligaciones legales y regulatorias</li>
              <li>Realizar análisis estadísticos y mejorar nuestros servicios</li>
              <li>Gestionar PQRs (Peticiones, Quejas y Recursos)</li>
              <li>Verificar la identidad y prevenir fraudes</li>
              <li>Enviar información comercial y promocional (con su consentimiento previo)</li>
            </ul>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Los datos personales no serán utilizados para finalidades 
                diferentes a las aquí descritas sin su autorización previa.
              </p>
            </div>
          </div>
        </section>

        {/* Derechos del Titular */}
        <section className="bg-neutral-white rounded-xl shadow-lg p-6 md:p-8 border border-neutral-gray-light">
          <h2 className="text-2xl font-bold text-neutral-dark mb-4 flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary-red" />
            5. Derechos del Titular de los Datos
          </h2>
          <div className="space-y-4 text-neutral-gray">
            <p>
              Como titular de los datos personales, usted tiene derecho a:
            </p>
            <ul className="list-none space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-dark">Conocer:</strong> Acceder de forma gratuita 
                  a sus datos personales que hayan sido objeto de tratamiento.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-dark">Actualizar:</strong> Solicitar la corrección 
                  de datos inexactos o incompletos.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-dark">Suprimir:</strong> Solicitar la supresión 
                  de datos cuando considere que no están siendo tratados conforme a los principios 
                  y deberes previstos en la ley.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-dark">Revocar:</strong> Revocar la autorización 
                  y/o solicitar la supresión del dato cuando en el tratamiento no se respeten los 
                  principios, derechos y garantías constitucionales y legales.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-dark">Solicitar prueba:</strong> Solicitar prueba 
                  de la autorización otorgada.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-dark">Presentar quejas:</strong> Presentar quejas 
                  ante la Superintendencia de Industria y Comercio por infracciones a la normativa 
                  de protección de datos.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-dark">Acceder:</strong> Acceder de forma gratuita 
                  a sus datos personales que hayan sido objeto de tratamiento.
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Procedimiento para Ejercer Derechos */}
        <section className="bg-neutral-white rounded-xl shadow-lg p-6 md:p-8 border border-neutral-gray-light">
          <h2 className="text-2xl font-bold text-neutral-dark mb-4">
            6. Procedimiento para Ejercer sus Derechos
          </h2>
          <div className="space-y-4 text-neutral-gray">
            <p>
              Para ejercer cualquiera de sus derechos, puede:
            </p>
            <div className="space-y-3">
              <div className="bg-neutral-gray-light rounded-lg p-4">
                <h3 className="font-semibold text-neutral-dark mb-2">Opción 1: Presentar una PQR</h3>
                <p className="text-sm mb-2">
                  Puede presentar una Petición a través de nuestro sistema de PQRs, especificando 
                  el derecho que desea ejercer.
                </p>
                <Link 
                  href="/pqrs/realizar"
                  className="inline-block text-primary-red hover:underline font-medium text-sm"
                >
                  Ir a Realizar PQR →
                </Link>
              </div>
              <div className="bg-neutral-gray-light rounded-lg p-4">
                <h3 className="font-semibold text-neutral-dark mb-2">Opción 2: Contacto Directo</h3>
                <p className="text-sm mb-2">
                  Puede contactarnos directamente por teléfono o correo electrónico:
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <a href={FITEL_PHONE_TEL} className="text-primary-red hover:underline">
                    📞 {FITEL_PHONE_DISPLAY}
                  </a>
                  <a href={`mailto:${FITEL_EMAIL}`} className="text-primary-red hover:underline">
                    ✉️ {FITEL_EMAIL}
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-amber-800">
                <strong>Tiempo de Respuesta:</strong> Nos comprometemos a responder su solicitud 
                en un plazo máximo de 10 días hábiles contados desde la recepción de la misma.
              </p>
            </div>
          </div>
        </section>

        {/* Medidas de Seguridad */}
        <section className="bg-neutral-white rounded-xl shadow-lg p-6 md:p-8 border border-neutral-gray-light">
          <h2 className="text-2xl font-bold text-neutral-dark mb-4 flex items-center gap-3">
            <Lock className="w-6 h-6 text-primary-red" />
            7. Medidas de Seguridad
          </h2>
          <div className="space-y-4 text-neutral-gray">
            <p>
              FITEL implementa medidas técnicas, administrativas y físicas para proteger sus datos 
              personales contra acceso no autorizado, pérdida, destrucción, alteración o divulgación:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Encriptación de datos sensibles</li>
              <li>Control de acceso mediante autenticación</li>
              <li>Monitoreo continuo de sistemas</li>
              <li>Copias de seguridad regulares</li>
              <li>Capacitación del personal en protección de datos</li>
              <li>Políticas de confidencialidad internas</li>
              <li>Auditorías periódicas de seguridad</li>
            </ul>
          </div>
        </section>

        {/* Transferencia de Datos */}
        <section className="bg-neutral-white rounded-xl shadow-lg p-6 md:p-8 border border-neutral-gray-light">
          <h2 className="text-2xl font-bold text-neutral-dark mb-4">
            8. Transferencia y Transmisión de Datos
          </h2>
          <div className="space-y-4 text-neutral-gray">
            <p>
              FITEL no transferirá datos personales a terceros, excepto en los siguientes casos:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Cuando sea necesario para la prestación del servicio (proveedores técnicos autorizados)</li>
              <li>Cuando exista autorización expresa del titular</li>
              <li>Cuando sea requerido por autoridades competentes en cumplimiento de la ley</li>
              <li>Cuando sea necesario para proteger los derechos de FITEL o de terceros</li>
            </ul>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-blue-800">
                <strong>Compromiso:</strong> En caso de transferencia a terceros, nos aseguramos de 
                que estos cumplan con los mismos estándares de protección de datos.
              </p>
            </div>
          </div>
        </section>

        {/* Cookies y Tecnologías Similares */}
        <section className="bg-neutral-white rounded-xl shadow-lg p-6 md:p-8 border border-neutral-gray-light">
          <h2 className="text-2xl font-bold text-neutral-dark mb-4 flex items-center gap-3">
            <Eye className="w-6 h-6 text-primary-red" />
            9. Cookies y Tecnologías Similares
          </h2>
          <div className="space-y-4 text-neutral-gray">
            <p>
              Nuestro sitio web utiliza cookies y tecnologías similares para mejorar su experiencia. 
              Las cookies son pequeños archivos de texto que se almacenan en su dispositivo.
            </p>
            <div>
              <h3 className="font-semibold text-neutral-dark mb-2">Tipos de Cookies que Utilizamos:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento del sitio</li>
                <li><strong>Cookies de rendimiento:</strong> Nos ayudan a entender cómo los usuarios interactúan con el sitio</li>
                <li><strong>Cookies de funcionalidad:</strong> Permiten recordar sus preferencias</li>
              </ul>
            </div>
            <p className="text-sm">
              Puede configurar su navegador para rechazar cookies, aunque esto puede afectar algunas 
              funcionalidades del sitio.
            </p>
          </div>
        </section>

        {/* Retención de Datos */}
        <section className="bg-neutral-white rounded-xl shadow-lg p-6 md:p-8 border border-neutral-gray-light">
          <h2 className="text-2xl font-bold text-neutral-dark mb-4">
            10. Retención de Datos
          </h2>
          <div className="space-y-4 text-neutral-gray">
            <p>
              Los datos personales serán conservados durante el tiempo necesario para cumplir con 
              las finalidades para las cuales fueron recopilados y mientras subsista la relación 
              contractual. Una vez finalizada la relación, los datos se conservarán durante el 
              tiempo requerido por la normativa legal aplicable.
            </p>
            <p>
              Después de este período, los datos serán eliminados de forma segura de nuestros 
              sistemas, salvo que exista una obligación legal que requiera su conservación.
            </p>
          </div>
        </section>

        {/* Modificaciones */}
        <section className="bg-neutral-white rounded-xl shadow-lg p-6 md:p-8 border border-neutral-gray-light">
          <h2 className="text-2xl font-bold text-neutral-dark mb-4">
            11. Modificaciones a esta Política
          </h2>
          <div className="space-y-4 text-neutral-gray">
            <p>
              FITEL se reserva el derecho de modificar esta política de privacidad. Los cambios 
              serán notificados a través de:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Correo electrónico a la dirección registrada</li>
              <li>Notificación en la factura mensual</li>
              <li>Publicación en nuestro sitio web</li>
            </ul>
            <p>
              Se recomienda revisar periódicamente esta política para estar informado sobre cómo 
              protegemos sus datos.
            </p>
          </div>
        </section>

        {/* Autorización */}
        <section className="bg-gradient-to-r from-primary-red to-primary-red/80 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Autorización para el Tratamiento de Datos
          </h2>
          <p className="text-center text-white/90 mb-6">
            Al contratar nuestros servicios o utilizar nuestro sitio web, usted autoriza a FITEL 
            para el tratamiento de sus datos personales de acuerdo con esta política de privacidad.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contacto"
              className="px-6 py-3 bg-white text-primary-red rounded-lg hover:bg-neutral-gray-light transition-colors font-semibold"
            >
              Ejercer Mis Derechos
            </Link>
            <Link
              href="/terminos-condiciones"
              className="px-6 py-3 bg-white text-primary-red rounded-lg hover:bg-neutral-gray-light transition-colors font-semibold"
            >
              Ver Términos y Condiciones
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
