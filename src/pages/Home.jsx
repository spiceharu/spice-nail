import { useMemo, useState } from "react";
import { loadSite } from "../lib/siteStore.js";
import Hero from "../components/Hero.jsx";
import BannerStrip from "../components/BannerStrip.jsx";
import MapEmbed from "../components/MapEmbed.jsx";

export default function Home(){
  const [site] = useState(loadSite());
  const order = useMemo(()=>site.sectionsOrder||[],[site]);

  const SNS = (
    <div className="card">
      <div style={{fontWeight:600,marginBottom:8}}>SNS</div>
      <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
        {site.socials?.youtube && <a href={site.socials.youtube} target="_blank">YouTube</a>}
        {site.socials?.tiktok && <a href={site.socials.tiktok} target="_blank">TikTok</a>}
        {site.socials?.instagram && <a href={site.socials.instagram} target="_blank">Instagram</a>}
        {site.socials?.x && <a href={site.socials.x} target="_blank">X</a>}
      </div>
    </div>
  );

  const Reservation = (
    <div className="card">
      <div style={{fontWeight:600,marginBottom:8}}>予約について</div>
      <p style={{color:"#6b7280",fontSize:14,marginBottom:12}}>
        予約フォームは後で差し替えます。現在はダミー案内です。LINE/DM/電話でご連絡ください。
      </p>
      <div className="pill">営業時間 10:00-19:00 / 火曜定休</div>
    </div>
  );

  const Price = (
    <div className="card">
      <div style={{fontWeight:600,marginBottom:8}}>メニュー / 料金</div>
      <ul style={{margin:0,padding:0,listStyle:"none"}}>
        {(site.menus||[]).map((m,i)=>(
          <li key={i} style={{display:"flex",justifyContent:"space-between",margin:"8px 0"}}>
            <span>{m.name}（{m.minutes}分）</span>
            <strong>¥{Number(m.price).toLocaleString()}</strong>
          </li>
        ))}
      </ul>
    </div>
  );

  const render = {
    hero: <Hero site={site} />,
    banner: <BannerStrip site={site} />,
    sns: SNS,
    reservation: Reservation,
    price: Price,
    map: <MapEmbed site={site} />
  };

  return (
    <>
      <Hero site={site} />
      <div className="container" style={{marginTop:16}}>
        {/* hero は最上に固定、他は順序に従って描画 */}
        {order.filter(k=>k!=="hero").map((k)=>(
          <div key={k} style={{margin:"16px 0"}}>{render[k]}</div>
        ))}
      </div>
      <div style={{textAlign:"center",padding:"40px 0",color:"#9ca3af"}}>© Spice Nail</div>
    </>
  );
}
