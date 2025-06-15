import { INTERNAL_API_URL } from '@/lib/config'

export async function GET() {
  const res = await fetch(`${INTERNAL_API_URL}/videos/metrics`)
  if (!res.ok) {
    return Response.json({ error: 'Failed to fetch metrics' }, { status: res.status })
  }

  const data = await res.json()
  return Response.json(data)
}
