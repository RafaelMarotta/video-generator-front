export async function GET(_, { params }) {
    const { id } = params
  
    const res = await fetch(`http://localhost:8000/videos/file/${id}`)
  
    return new Response(res.body, {
      headers: {
        'Content-Type': 'video/mp4'
      }
    })
  }
  