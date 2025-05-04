import { INTERNAL_API_URL } from '@/lib/config'

export async function GET(_, { params }) {
    const { id } = params
  
    const res = await fetch(`${INTERNAL_API_URL}/videos/file/${id}`)
  
    return new Response(res.body, {
      headers: {
        'Content-Type': 'video/mp4'
      }
    })
  }
  