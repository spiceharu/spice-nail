// src/pages/Home.jsx
import Hero from "../components/Hero.jsx";
import BannerStrip from "../components/BannerStrip.jsx";
import MapEmbed from "../components/MapEmbed.jsx";

const KEY = "spice-nail-site-v3";

function loadSite() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function Home() {
  const site =
    loadSite() || {
      heroPc: "/public/images/hero-desktop.png",
      heroSp: "/public/images/hero-mobile.png",
      bgImage: "",
      sns: [],
      map: { src: "", address: "" }
    };

  return (
    <div className="app-shell">
      <Hero
        pcImage={site.heroPc}
        spImage={site.heroSp}
        bgImage={site.bgImage}
      />

      {/* SNS */}
      <div className="card">
        <div className="section-title">SNS</div>
        {site.sns && site.sns.length ? (
          <div className="sns-grid">
            {site.sns.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="sns-item"
              >
                <div style={{ fontWeight: 600 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: "#777" }}>{s.url}</div>
              </a>
            ))}
          </div>
        ) : (
          <p>各種SNSリンクをここに並べられます。</p>
        )}
      </div>

      {/* 予約 */}
      <div className="card">
        <div className="section-title">予約について</div>
        <p>
          予約フォームは後で差し替えます。現在は仮案内です。LINE/DM/電話でご連絡ください。
        </p>
        <p style={{ fontSize: 13, color: "#888" }}>
          営業時間 10:00-19:00 / 火曜定休
        </p>
      </div>

      {/* Map */}
      <MapEmbed src={site.map?.src} address={site.map?.address} />

      <div className="footer">© Spice Nail</div>
    </div>
  );
}
