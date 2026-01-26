export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Layout específico para rutas admin
  // El AdminRouteHandler oculta Header/Footer automáticamente
  return (
    <div className="min-h-screen bg-neutral-gray-light">
      {children}
    </div>
  )
}
