import { useMemo } from "react";

export default function BannerStrip({ site }) {
  const imgs = useMemo(
    () => (site.bannersDesktop || []).concat(site.bannersMobile || []),
    [site]
  );
  if (!imgs.length) return null;
  return (
    <section className="card">
      <div className="row">
        {imgs.map((src, i) => (
          <img key={i} src={src} alt="" style={{ width: "33.33%", height: 140, objectFit: "cover", borderRadius: 10 }} />
        ))}
      </div>
    </section>
  );
}
