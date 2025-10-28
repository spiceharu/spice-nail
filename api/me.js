// /api/me.js
export const config = { runtime: "nodejs" };

const COOKIE_NAME = "admin_session";

export default async function handler(req, res) {
  const cookie = req.headers.cookie || "";
  const authed = cookie.split(";").some((p) => p.trim().startsWith(`${COOKIE_NAME}=ok`));
  return res.status(200).json({ authed });
}
