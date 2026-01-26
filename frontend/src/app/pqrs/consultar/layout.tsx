import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Consultar PQRs - FITEL | Consulta el estado de tus solicitudes',
  description: 'Consulta el estado de tus peticiones, quejas y recursos presentadas a FITEL.',
}

export default function ConsultarPQRsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
