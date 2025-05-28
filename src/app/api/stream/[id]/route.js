import { INTERNAL_API_URL } from '@/lib/config'

export async function GET(_, context) {
  const params = await context.params;
  const { id } = params;

  const res = await fetch(`${INTERNAL_API_URL}/videos/stream/${id}`, {
    headers: {
      'Accept': 'text/event-stream',
    }
  })

  if (!res.ok) {
    return new Response('Failed to connect to SSE', { status: res.status })
  }

  return new Response(res.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    }
  })
}
  