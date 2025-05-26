import { INTERNAL_API_URL } from '@/lib/config'

export async function GET(request, { params }) {
  const id = await params.id

  const res = await fetch(`${INTERNAL_API_URL}/videos/progress/${id}`)

  if (!res.ok) {
    return new Response('Failed to fetch progress', { status: res.status })
  }

  const data = await res.json()
  return Response.json(data)
} 