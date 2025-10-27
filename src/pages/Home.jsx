import { useEffect, useState } from 'react';
import Hero from '../components/Hero.jsx';
import MapEmbed from '../components/MapEmbed.jsx';
import { DEFAULT_SITE, loadSite, saveSite } from '../lib/siteStore.js';
import { fetchConfig } from '../lib/siteConfig.js';

export default function Home() {
  const [site, setSite] = useState(loadSite());

  // サーバ設定で上書き（無ければ DEFAULT_SITE）
  useEffect(() => {
    fetchConfig()
      .then((cfg) => {
        const merged = { ...DEFAULT_SITE, ...cfg };
        setSite(merged);
        saveSite(merged);
      })
      .catch(() => {
        // 初回などで未設定ならそのまま
      });
  }, []);

  return (
    <div className="container">
      <Hero heroUrl={site.heroUrl || DEFAULT_SITE.heroUrl} />

      <div className="card">
        <h3>SNS</h3>
        <p>各種SNSリンクをここに並べられます。</p>
      </div>

      <div className="card">
        <h3>予約について</h3>
        <p>予約フォームは後で差し替えます。現在は仮案内です。LINE/DM/電話でご連絡ください。</p>
        <p><small>営業時間 10:00-19:00 / 火曜定休</small></p>
      </div>

      <MapEmbed site={site} />

      <p style={{ textAlign: 'center', color: '#999' }}>© Spice Nail</p>
    </div>
  );
}
