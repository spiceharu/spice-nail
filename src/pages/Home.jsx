// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import { fetchConfig } from '../lib/siteConfig';
import { loadSite } from '../lib/siteStore';

// 予約フォーム（シンプル動作）
// ※メール送信などは未接続。まず UI を出し、後で /api/reserve に繋ぐ前提です。
function ReserveForm() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [note, setNote] = useState('');
  const [ok, setOk] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    // ここで /api/reserve と繋げたい場合はコメントアウト解除して実装
    // const res = await fetch('/api/reserve', { method:'POST', body: JSON.stringify({name, contact, note})});
    // if(res.ok){ ... }
    setOk(true);
    setName('');
    setContact('');
    setNote('');
  }

  return (
    <form onSubmit={onSubmit}>
      <div style={{ display:'grid', gap:10 }}>
        <input
          placeholder="お名前"
          value={name}
          onChange={e=>setName(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          placeholder="連絡先（電話 / LINE / XのID など）"
          value={contact}
          onChange={e=>setContact(e.target.value)}
          required
          style={inputStyle}
        />
        <textarea
          placeholder="ご希望日時やメニューなど"
          value={note}
          onChange={e=>setNote(e.target.value)}
          rows={4}
          style={inputStyle}
        />
        <button type="submit" style={btnStyle}>送信する</button>
        {ok && <p style={{ color:'#1b5e20' }}>送信しました（仮）。LINE/DM/お電話でもご連絡ください。</p>}
      </div>
    </form>
  );
}

const cardStyle = {
  margin: '24px auto',
  maxWidth: 800,
  background: '#fff',
  padding: 20,
  borderRadius: 12,
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
};

const inputStyle = {
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #ddd',
  fontSize: 16,
};

const btnStyle = {
  background:'#111',
  color:'#fff',
  padding:'10px 14px',
  borderRadius:8,
  border:'none',
  cursor:'pointer'
};

export default function Home() {
  const [site, setSite] = useState(loadSite()); // まずローカルから（APIが落ちても表示される）

  useEffect(() => {
    fetchConfig()
      .then(cfg => setSite(prev => ({ ...prev, ...cfg })))
      .catch(() => {}); // API落ちててもローカル既定値で表示
  }, []);

  // 背景を適用（PC/スマホ）
  const bgUrl =
    window.innerWidth < 768
      ? site?.background?.mobileImage || ''
      : site?.background?.desktopImage || '';

  return (
    <main
      style={{
        fontFamily: 'sans-serif',
        paddingBottom: 40,
        background: bgUrl ? `url(${bgUrl}) center/cover no-repeat fixed` : '#f6f7f8',
        minHeight: '100vh'
      }}
    >
      {/* HERO */}
      <Hero
        desktopUrl={site?.hero?.desktopImage || '/images/hero-desktop.png'}
        mobileUrl={site?.hero?.mobileImage || '/images/hero-mobile.png'}
      />

      {/* SNS */}
      <section className="card" style={cardStyle}>
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>SNS</h2>
        <p>各種SNSをここに配置できます。</p>
        <div style={{ display:'flex', gap:12, marginTop:12, flexWrap:'wrap', justifyContent:'center' }}>
          {site?.socials?.instagram && (
            <a href={site.socials.instagram} target="_blank" rel="noreferrer" style={snsBtn('#d6249f')}>
              <img src="https://cdn-icons-png.flaticon.com/512/1384/1384063.png" alt="" width="20" height="20" />
              Instagram
            </a>
          )}
          {site?.socials?.x && (
            <a href={site.socials.x} target="_blank" rel="noreferrer" style={snsBtn('#000')}>
              <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="" width="20" height="20" />
              X（Twitter）
            </a>
          )}
          {site?.socials?.line && (
            <a href={site.socials.line} target="_blank" rel="noreferrer" style={snsBtn('#00B900')}>
              <img src="https://cdn-icons-png.flaticon.com/512/889/889123.png" alt="" width="20" height="20" />
              LINE
            </a>
          )}
          {site?.socials?.tiktok && (
            <a href={site.socials.tiktok} target="_blank" rel="noreferrer" style={snsBtn('#111')}>
              <img src="https://cdn-icons-png.flaticon.com/512/3046/3046125.png" alt="" width="20" height="20" />
              TikTok
            </a>
          )}
          {site?.socials?.youtube && (
            <a href={site.socials.youtube} target="_blank" rel="noreferrer" style={snsBtn('#e62117')}>
              <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="" width="20" height="20" />
              YouTube
            </a>
          )}
        </div>
      </section>

      {/* 予約 */}
      <section className="card" style={cardStyle}>
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>予約について</h2>
        <p style={{ marginBottom: 16 }}>
          予約フォームはこちらから送信できます。現在は仮案内です。LINE/DM/電話でもご連絡ください。
        </p>
        <ReserveForm />
        <p style={{ marginTop: 12, fontSize: 13, color: '#555' }}>
          営業時間 10:00〜19:00 ／ 火曜定休
        </p>
      </section>

      {/* Google Map */}
      <section className="card" style={cardStyle}>
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>アクセス</h2>
        {site?.map?.embedSrc ? (
          <iframe
            title="Google Map"
            src={site.map.embedSrc}
            width="100%"
            height="300"
            style={{ border: 0, borderRadius: 12 }}
            loading="lazy"
            allowFullScreen
          />
        ) : (
          <p>管理画面から Google マップの埋め込み URL を保存するとここに表示されます。</p>
        )}
      </section>

      <footer style={{ textAlign: 'center', marginTop: 32, fontSize: 14, color: '#777' }}>
        © Spice Nail
      </footer>
    </main>
  );
}

function snsBtn(color) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    textDecoration: 'none',
    color,
    border: '1px solid #eee',
    padding: '6px 12px',
    borderRadius: 8,
    background: '#fff'
  };
}
