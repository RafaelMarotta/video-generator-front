// src/app/api/video-file/[id]/route.js

export const dynamic = 'force-dynamic';

import { INTERNAL_API_URL } from '@/lib/config'

export async function GET(request, context) {
  const { id } = context.params

  const res = await fetch(`${INTERNAL_API_URL}/videos/file/${id}`)

  if (res.status === 404) {
    return new Response('Not Found', { status: 404 })
  }

  return new Response(res.body, {
    headers: {
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes'
    }
  })
}
