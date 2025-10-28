// /api/pw-check.js
export const config = { runtime: 'nodejs' };

export default function handler(req, res) {
  const v = process.env.ADMIN_PASSWORD || '';
  // 値そのものは返さない。読み込み可否と長さだけ。
  res.status(200).json({ ok: !!v, len: v.length });
}
