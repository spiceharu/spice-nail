export default function Hero() {
  return (
    <section className="hero">
      <picture>
        {/* 768px以上ならデスクトップ画像 */}
        <source media="(min-width: 768px)" srcSet="/images/hero-desktop.jpg" />
        {/* それ未満はモバイル画像 */}
        <img src="/images/hero-mobile.jpg" alt="hero" className="hero-img" />
      </picture>
      <div className="hero-overlay">
        {/* 必要ならキャッチやロゴをここに */}
        {/* <h1>Spice Nail</h1> */}
      </div>
    </section>
  );
}
