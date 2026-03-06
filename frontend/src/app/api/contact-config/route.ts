import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
    const response = await fetch(`${apiUrl}/config/contact`, {
      next: { revalidate: 60 }, // caché 60s en el servidor
    })

    if (!response.ok) {
      return NextResponse.json({ success: false }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
