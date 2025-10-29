// src/pages/Home.jsx
import Hero from '../components/Hero';
import ReserveForm from '../components/ReserveForm';
import { useEffect, useState } from 'react';

export default function Home() {
  const [heroUrl, setHeroUrl] = useState('/images/hero-desktop.png');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setHeroUrl(mobile ? '/images/hero-mobile.png' : '/images/hero-desktop.png');
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  return (
    <main style={{ fontFamily: 'sans-serif', paddingBottom: 40 }}>
      {/* トップ画像 */}
      <Hero heroUrl={heroUrl} />

      {/* SNSセクション */}
      <section
        className="card"
        style={{
          margin: '24px auto',
          maxWidth: 800,
          background: '#fff',
          padding: 20,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>SNS</h2>
        <p>各種SNSリンクをここに並べられます。</p>
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginTop: 12,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              textDecoration: 'none',
              color: '#d6249f',
              border: '1px solid #eee',
              padding: '6px 12px',
              borderRadius: 8,
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/1384/1384063.png"
              alt="Instagram"
              width="20"
              height="20"
            />
            Instagram
          </a>

          <a
            href="https://x.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              textDecoration: 'none',
              color: '#000',
              border: '1px solid #eee',
              padding: '6px 12px',
              borderRadius: 8,
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/733/733579.png"
              alt="X"
              width="20"
              height="20"
            />
            X（Twitter）
          </a>

          <a
            href="https://line.me/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              textDecoration: 'none',
              color: '#00B900',
              border: '1px solid #eee',
              padding: '6px 12px',
              borderRadius: 8,
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/889/889123.png"
              alt="LINE"
              width="20"
              height="20"
            />
            LINE
          </a>
        </div>
      </section>

      {/* 予約セクション */}
      <section
        className="card"
        style={{
          margin: '24px auto',
          maxWidth: 800,
          background: '#fff',
          padding: 20,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>予約について</h2>
        <p style={{ marginBottom: 16 }}>
          予約フォームは以下より送信できます。現在は仮案内です。LINE/DM/電話でもご連絡ください。
        </p>
        <ReserveForm />
        <p style={{ marginTop: 12, fontSize: 13, color: '#555' }}>
          営業時間 10:00〜19:00 ／ 火曜定休
        </p>
      </section>

      {/* Googleマップ */}
      <section
        className="card"
        style={{
          margin: '24px auto',
          maxWidth: 800,
          background: '#fff',
          padding: 20,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>アクセス</h2>
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.887949535206!2d139.7671259152587!3d35.68123618019325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188bf59e2e0f0d%3A0xe7c7bcbcbfb7a1a!2z5p2x5Lqs6YO95paw5a6_!5e0!3m2!1sja!2sjp!4v1690000000000!5m2!1sja!2sjp"
          width="100%"
          height="300"
          style={{ border: 0, borderRadius: 12 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </section>

      {/* フッター */}
      <footer style={{ textAlign: 'center', marginTop: 32, fontSize: 14, color: '#777' }}>
        © Spice Nail
      </footer>
    </main>
  );
}
