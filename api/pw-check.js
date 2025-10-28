// /api/pw-check.js
// Node ランタイムで走る確認用API（値は開示しない）
export const config = { runtime: 'nodejs' };

export default function handler(req, res) {
  const v = process.env.ADMIN_PASSWORD || '';
  res.status(200).json({ ok: !!v, len: v.length });
}
