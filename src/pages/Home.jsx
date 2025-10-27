// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { fetchConfig } from '../lib/siteConfig';
import Hero from '../components/Hero';

export default function Home() {
  const [cfg, setCfg] = useState(null);

  useEffect(() => {
    fetchConfig().then(setCfg).catch(console.error);
  }, []);

  if (!cfg) return null;

  return (
    <div style={{ padding: 16 }}>
      <Hero heroUrl={cfg.heroUrl} />

      {/* ここに既存のSNSや予約などのブロックを続けて置いてOK */}
      <section style={{ marginTop: 24 }}>
        <h2>SNS</h2>
        {/* ... */}
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>予約について</h2>
        {/* ... */}
      </section>
    </div>
  );
}
