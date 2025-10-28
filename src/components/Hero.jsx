export default function Hero({ site }) {
  const isMobile =
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

  const src = isMobile
    ? site.hero?.mobileImage || "/images/hero-mobile.png"
    : site.hero?.desktopImage || "/images/hero-desktop.png";

  return (
    <section className="card">
      <img src={src} alt="Top" className="hero-img" style={{ height: isMobile ? 360 : 320, objectFit: "cover" }} />
    </section>
  );
}
