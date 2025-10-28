import { useEffect, useState } from "react";
import { fetchConfig } from "../lib/siteConfig";
import { DEFAULT_SITE } from "../lib/siteStore";
import Hero from "../components/Hero";
import BannerStrip from "../components/BannerStrip";
import MapEmbed from "../components/MapEmbed";

const SECTION_RENDERERS = {
  hero: (site) => <Hero site={site} />,
  banner: (site) => <BannerStrip site={site} />,
  sns: (site) => (
    <section className="card">
      <h2>SNS</h2>
      <div className="row">
        {Object.entries(site.socials || {}).map(([k, v]) =>
          v ? (
            <a key={k} href={v} target="_blank" rel="noreferrer" className="pill">
              <span>{k.toUpperCase()}</span>
              <span className="small">{v}</span>
            </a>
          ) : null
        )}
      </div>
    </section>
  ),
  reservation: () => (
    <section className="card">
      <h2>予約について</h2>
      <p>予約フォームは後で差し替えます。現在は仮案内です。LINE/DM/電話でご連絡ください。</p>
      <p className="small">営業時間 10:00–19:00 / 火曜定休</p>
    </section>
  ),
  map: (site) => <MapEmbed site={site} />
};

export default function Home() {
  const [site, setSite] = useState(DEFAULT_SITE);

  useEffect(() => {
    fetchConfig().then(setSite).catch(() => setSite(DEFAULT_SITE));
  }, []);

  return (
    <div className="container">
      {(site.sectionsOrder || DEFAULT_SITE.sectionsOrder).map((key) => (
        <div key={key}>{SECTION_RENDERERS[key]?.(site) || null}</div>
      ))}
      <div style={{ textAlign: "center", color: "#777", padding: 20 }}>© Spice Nail</div>
    </div>
  );
}
