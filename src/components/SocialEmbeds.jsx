// /src/components/SocialEmbeds.jsx
// 各SNSのURLを貼るだけで埋め込み表示（YouTube/TikTokはiframe、Instagram/Xは公式ウィジェット）
import { useEffect } from "react";

function YouTubeEmbed({ url }) {
  // 受け取りURLが watch?v=... の場合は embed に変換
  let src = url;
  const m = url.match(/watch\\?v=([\\w-]+)/);
  if (m) src = `https://www.youtube.com/embed/${m[1]}`;
  return (
    <iframe className="embed" height="320" src={src} allow="autoplay; encrypted-media" allowFullScreen />
  );
}
function TikTokEmbed({ url }) {
  // 公式oEmbedがあるが、クライアント表示優先でiframe埋め込み
  return (
    <iframe className="embed" height="600" src={`https://www.tiktok.com/embed/v2/${encodeURIComponent(url)}`} />
  );
}
function InstagramEmbed({ url }) {
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://www.instagram.com/embed.js";
    s.async = true;
    document.body.appendChild(s);
    return () => { document.body.removeChild(s); };
  }, []);
  return (
    <blockquote className="instagram-media" data-instgrm-permalink={url} data-instgrm-version="14">
      <a href={url}>Instagram Post</a>
    </blockquote>
  );
}
function XEmbed({ url }) {
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://platform.twitter.com/widgets.js";
    s.async = true;
    document.body.appendChild(s);
    return () => { document.body.removeChild(s); };
  }, []);
  return (
    <blockquote className="twitter-tweet">
      <a href={url}>Post</a>
    </blockquote>
  );
}

export default function SocialEmbeds({ socials }) {
  const blocks = [];
  if (socials.youtube) blocks.push({ k: "YouTube", node: <YouTubeEmbed url={socials.youtube} /> });
  if (socials.tiktok) blocks.push({ k: "TikTok", node: <TikTokEmbed url={socials.tiktok} /> });
  if (socials.instagram) blocks.push({ k: "Instagram", node: <InstagramEmbed url={socials.instagram} /> });
  if (socials.x) blocks.push({ k: "X", node: <XEmbed url={socials.x} /> });

  if (!blocks.length) return (
    <section className="card"><h2>SNS</h2><div style={{color:"#777"}}>SNSリンクは未設定です</div></section>
  );

  return (
    <section className="card">
      <h2>SNS</h2>
      {blocks.map(({k, node}) => (
        <div key={k} style={{ margin: "10px 0" }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>{k}</div>
          {node}
        </div>
      ))}
    </section>
  );
}
