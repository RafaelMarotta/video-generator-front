import { INTERNAL_API_URL } from '@/lib/config'

export async function POST(req) {
    const body = await req.json()
  
    const res = await fetch(`${INTERNAL_API_URL}/videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
  
    const data = await res.json()
    return Response.json(data)
  }

