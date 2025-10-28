// /src/pages/Home.jsx
import { useEffect, useState } from "react";
import { fetchConfigSafe, DEFAULT_SITE } from "../lib/siteConfig";
import Hero from "../components/Hero.jsx";
import SocialEmbeds from "../components/SocialEmbeds.jsx";
import MapEmbed from "../components/MapEmbed.jsx";

export default function Home() {
  const [site, setSite] = useState(DEFAULT_SITE);

  useEffect(() => {
    (async () => {
      const cfg = await fetchConfigSafe();
      setSite(cfg);
      // 背景画像反映
      if (cfg.backgroundImage) {
        document.body.style.backgroundImage = `url(${cfg.backgroundImage})`;
      } else {
        document.body.style.backgroundImage = "";
      }
    })();
  }, []);

  const heroUrl =
    typeof window !== "undefined" && window.innerWidth >= 768
      ? site.hero.desktopImage
      : site.hero.mobileImage;

  return (
    <main>
      <Hero heroUrl={heroUrl} />
      <SocialEmbeds socials={site.socials || {}} />
      <section className="card">
        <h2>予約について</h2>
        <p>オンライン予約ができます。下のボタンからどうぞ。</p>
        <a className="btn" href="/reserve">予約ページへ</a>
      </section>
      <MapEmbed site={site} />
      <footer>© Spice Nail</footer>
    </main>
  );
}
