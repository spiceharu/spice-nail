// /src/pages/Home.jsx
import { useEffect, useState } from "react";
import { fetchConfigSafe, DEFAULT_SITE } from "../lib/siteConfig";
import Hero from "../components/Hero.jsx";
import BannerStrip from "../components/BannerStrip.jsx";
import MapEmbed from "../components/MapEmbed.jsx";

export default function Home() {
  const [site, setSite] = useState(DEFAULT_SITE);

  useEffect(() => {
    (async () => setSite(await fetchConfigSafe()))();
  }, []);

  const heroUrl =
    typeof window !== "undefined" && window.innerWidth >= 768
      ? site.hero.desktopImage
      : site.hero.mobileImage;

  return (
    <main>
      <Hero heroUrl={heroUrl} />
      <section className="card">
        <h2>SNS</h2>
        <p>各種SNSリンクをここに並べられます。</p>
      </section>

      <section className="card">
        <h2>予約について</h2>
        <p>
          予約フォームは後で差し替えます。現在は仮案内です。LINE/DM/電話でご連絡ください。
        </p>
        <p>営業時間 10:00–19:00 / 火曜定休</p>
      </section>

      <BannerStrip site={site} />
      <MapEmbed site={site} />

      <footer>© Spice Nail</footer>
    </main>
  );
}
