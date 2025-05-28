import { INTERNAL_API_URL } from '@/lib/config'

export async function GET(_, context) {
    const params = await context.params;
    const { id } = params;

    const res = await fetch(`${INTERNAL_API_URL}/videos/${id}`)
    const data = await res.json()
    return Response.json(data)
}