export async function onRequestGet(context) {
  const { env, request } = context
  const id = new URL(request.url).searchParams.get('id')

  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
  }

  const res = await fetch(`https://api.polar.sh/v1/checkouts/${id}`, {
    headers: { Authorization: `Bearer ${env.POLAR_ACCESS_TOKEN}` },
  })

  if (!res.ok) {
    return new Response(JSON.stringify({ error: `Polar error: ${res.status}` }), { status: res.status, headers: { 'Content-Type': 'application/json' } })
  }

  const data = await res.json()
  return new Response(JSON.stringify({ status: data.status }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
