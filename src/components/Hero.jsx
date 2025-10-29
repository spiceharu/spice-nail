// src/components/Hero.jsx
export default function Hero({ desktopUrl, mobileUrl }) {
  // <picture> を使って幅で自動切り替え
  return (
    <section className="hero" style={{ margin: '0 auto', maxWidth: 1200 }}>
      <picture>
        {mobileUrl ? (
          <source media="(max-width: 767px)" srcSet={mobileUrl} />
        ) : null}
        <img
          src={desktopUrl}
          alt="Top"
          style={{
            width: '100%',
            height: 320,
            objectFit: 'cover',
            borderRadius: 12,
            display: 'block',
          }}
        />
      </picture>
    </section>
  );
}
