// /src/components/BannerStrip.jsx
export default function BannerStrip({ site }) {
  const isPc = typeof window !== "undefined" && window.innerWidth >= 768;
  const imgs = isPc ? site.bannersDesktop ?? [] : site.bannersMobile ?? [];
  if (!imgs.length) return null;

  return (
    <section className="card bannerWrap">
      <div className="bannerTrack">
        {imgs.map((src, i) => (
          <img key={i} src={src} alt={`banner-${i}`} className="banner-gi" />
        ))}
      </div>
    </section>
  );
}
