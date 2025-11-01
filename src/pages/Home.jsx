// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { fetchConfig } from "../lib/siteConfig.js";
import { loadSite, saveSite, DEFAULT_SITE } from "../lib/siteStore.js";
import Hero from "../components/Hero.jsx";
import BannerStrip from "../components/BannerStrip.jsx";
import MapEmbed from "../components/MapEmbed.jsx";

export default function Home() {
  const [site, setSite] = useState(DEFAULT_SITE);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // まずはキャッシュを読み込む
    const cached = loadSite();
    setSite(cached);

    // ついでにサーバーから本物を取る
    fetchConfig()
      .then((data) => {
        setSite(data);
        saveSite(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const bg = isMobile
    ? site.background?.sp || site.background?.pc
    : site.background?.pc || site.background?.sp;

  return (
    <div
      style={{
        backgroundImage: bg ? `url(${bg})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh"
      }}
    >
      <div className="app-shell">
        <Hero pc={site.hero?.pc} sp={site.hero?.sp} />

        <BannerStrip banners={site.banners} />

        {/* SNS */}
        <div className="card">
          <div className="section-title">SNS</div>
          {site.socials && site.socials.length ? (
            <div className="sns-grid">
              {site.socials.map((s, i) => (
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

        {/* 予約ダミー */}
        <div className="card">
          <div className="section-title">予約について</div>
          <p>予約フォームは後で実装予定です。LINE / DM / 電話からご連絡ください。</p>
        </div>

        <MapEmbed src={site.map?.embedSrc} address={site.map?.address} />

        <div className="footer">© Spice Nail</div>
      </div>
    </div>
  );
}
