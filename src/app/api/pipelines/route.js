import { INTERNAL_API_URL } from '@/lib/config'

export async function GET() {
    const res = await fetch(`${INTERNAL_API_URL}/pipelines`)
    const data = await res.json()
    return Response.json(data)
  }
  