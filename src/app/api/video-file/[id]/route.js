// src/app/api/video-file/[id]/route.js

export const dynamic = 'force-dynamic';

import { INTERNAL_API_URL } from '@/lib/config'

export async function GET(request, context) {
  const params = await context.params;
  const { id } = params;

  const res = await fetch(`${INTERNAL_API_URL}/videos/file/${id}`)

  if (res.status === 404) {
    return new Response('Not Found', { status: 404 })
  }

  const headers = new Headers(res.headers)
  headers.set('Content-Type', 'video/mp4')
  headers.set('Accept-Ranges', 'bytes')

  return new Response(res.body, {
    headers
  })
}
