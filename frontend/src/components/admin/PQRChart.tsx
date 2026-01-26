'use client'

interface PQRChartProps {
  data: Array<{
    date: string
    count: number
  }>
}

export function PQRChart({ data }: PQRChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-neutral-gray">
        <p>No hay datos disponibles para mostrar</p>
      </div>
    )
  }

  // Calcular dimensiones del gráfico
  const width = 800
  const height = 300
  const padding = { top: 20, right: 20, bottom: 40, left: 50 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  // Encontrar valores máximos y mínimos
  const maxCount = Math.max(...data.map(d => d.count), 1)
  const minCount = Math.min(...data.map(d => d.count), 0)
  const countRange = maxCount - minCount || 1

  // Calcular puntos para la línea
  const points = data.map((item, index) => {
    const x = padding.left + (index / (data.length - 1 || 1)) * chartWidth
    const y = padding.top + chartHeight - ((item.count - minCount) / countRange) * chartHeight
    return { x, y, ...item }
  })

  // Crear path para la línea
  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')

  // Crear área bajo la línea
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`

  return (
    <div className="w-full overflow-x-auto">
      <svg width={width} height={height} className="w-full h-auto">
        {/* Grid horizontal */}
        {[0, 1, 2, 3, 4].map(i => {
          const y = padding.top + (chartHeight / 4) * i
          return (
            <line
              key={`grid-h-${i}`}
              x1={padding.left}
              y1={y}
              x2={padding.left + chartWidth}
              y2={y}
              stroke="#e5e7eb"
              strokeDasharray="3 3"
            />
          )
        })}

        {/* Grid vertical */}
        {data.map((_, index) => {
          if (index % Math.ceil(data.length / 5) !== 0 && index !== data.length - 1) return null
          const x = padding.left + (index / (data.length - 1 || 1)) * chartWidth
          return (
            <line
              key={`grid-v-${index}`}
              x1={x}
              y1={padding.top}
              x2={x}
              y2={padding.top + chartHeight}
              stroke="#e5e7eb"
              strokeDasharray="3 3"
            />
          )
        })}

        {/* Área bajo la línea */}
        <path
          d={areaPath}
          fill="url(#gradient)"
          opacity={0.2}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#dc2626" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#dc2626" stopOpacity={0.05} />
          </linearGradient>
        </defs>

        {/* Línea */}
        <path
          d={linePath}
          fill="none"
          stroke="#dc2626"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Puntos */}
        {points.map((point, index) => (
          <g key={`point-${index}`}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#dc2626"
              className="hover:r-6 transition-all cursor-pointer"
            />
            {/* Tooltip en hover */}
            <title>{`${point.date}: ${point.count} PQRs`}</title>
          </g>
        ))}

        {/* Etiquetas del eje Y */}
        {[0, 1, 2, 3, 4].map(i => {
          const value = Math.round(minCount + (countRange / 4) * (4 - i))
          const y = padding.top + (chartHeight / 4) * i
          return (
            <text
              key={`y-label-${i}`}
              x={padding.left - 10}
              y={y + 4}
              textAnchor="end"
              fontSize="12"
              fill="#6b7280"
            >
              {value}
            </text>
          )
        })}

        {/* Etiquetas del eje X */}
        {data.map((item, index) => {
          if (index % Math.ceil(data.length / 5) !== 0 && index !== data.length - 1) return null
          const x = padding.left + (index / (data.length - 1 || 1)) * chartWidth
          return (
            <text
              key={`x-label-${index}`}
              x={x}
              y={height - padding.bottom + 20}
              textAnchor="middle"
              fontSize="12"
              fill="#6b7280"
            >
              {item.date}
            </text>
          )
        })}
      </svg>

      {/* Leyenda */}
      <div className="flex items-center justify-center mt-4 space-x-2">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-primary-red"></div>
          <span className="text-sm text-neutral-gray">PQRs recibidas</span>
        </div>
      </div>
    </div>
  )
}
