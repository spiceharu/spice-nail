import { useEffect, useState } from 'react';
import { fetchConfig } from '../lib/siteConfig';
import { DEFAULT_SITE, loadSite } from '../lib/siteStore';

export default function Home() {
  const [site, setSite] = useState(DEFAULT_SITE);

  useEffect(() => {
    setSite(loadSite());
    fetchConfig().then(c => setSite(prev => ({ ...prev, ...c }))).catch(()=>{});
  }, []);

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const heroUrl = isMobile ? site.hero.mobileImage || site.hero.desktopImage : site.hero.desktopImage || site.hero.mobileImage;
  const bgUrl   = isMobile ? site.background.mobileImage || site.background.desktopImage : site.background.desktopImage || site.background.mobileImage;

  return (
    <div
      style={{
        backgroundImage: bgUrl ? `url(${bgUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container">
        {/* HERO */}
        <section className="hero card" style={{ padding: 0 }}>
          {heroUrl ? (
            <img src={heroUrl} alt="Top" className="hero-img" />
          ) : (
            <div className="placeholder" style={{ height: 340 }}>トップ画像未設定</div>
          )}
        </section>

        {/* SNS */}
        <section className="card">
          <h2>SNS</h2>
          <div className="grid2">
            {Object.entries(site.socials).map(([k, v]) => (
              <div key={k}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>
                  {k === 'x' ? 'X（Twitter）' : k.charAt(0).toUpperCase() + k.slice(1)}
                </div>
                {v ? <a href={v} target="_blank" rel="noreferrer">{v}</a> : <span style={{ color:'#888' }}>未設定</span>}
              </div>
            ))}
          </div>
        </section>

        {/* 予約（ダミー：送信だけ） */}
        <section className="card">
          <h2>予約について</h2>
          <p>予約フォームは今後拡張予定です。現在は仮案内です。LINE/DM/電話でご連絡ください。</p>
          <div style={{ color:'#6b7280', fontSize:14, marginTop:8 }}>
            営業時間 10:00–19:00 / 火曜定休
          </div>
        </section>

        {/* MAP */}
        {site.map.embedSrc && (
          <section className="card">
            <h2>アクセス（Googleマップ）</h2>
            <iframe
              title="map"
              src={site.map.embedSrc}
              width="100%" height="320" loading="lazy"
              style={{ border:0, borderRadius: 12 }}
              referrerPolicy="no-referrer-when-downgrade"
            />
            {site.map.address && <div style={{ marginTop: 8 }}>{site.map.address}</div>}
          </section>
        )}

        <div style={{ textAlign:'center', color:'#6b7280', margin: '24px 0' }}>
          © Spice Nail
        </div>
      </div>
    </div>
  );
}
