export async function GET(_, { params }) {
    const { id } = params
  
    const res = await fetch(`http://localhost:8000/videos/stream/${id}`, {
      headers: {
        'Accept': 'text/event-stream',
      }
    })
  
    return new Response(res.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      }
    })
  }
  