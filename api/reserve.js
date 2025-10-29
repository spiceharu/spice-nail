// /api/reserve.js
export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  let data = null;
  try {
    data = await req.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'INVALID_JSON' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const { name, contact, date, menu, note } = data || {};
  if (!name || !contact || !date) {
    return new Response(JSON.stringify({ ok: false, error: 'REQUIRED' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  // まずは受け取るだけのダミー（保存／メール送信なし）
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'content-type': 'application/json' },
  });
}
