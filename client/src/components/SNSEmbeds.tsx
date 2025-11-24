import { useEffect } from "react";

interface SNSEmbedsProps {
  tiktokUrl?: string;
  xUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
}

export default function SNSEmbeds({
  tiktokUrl,
  xUrl,
  youtubeUrl,
  instagramUrl,
}: SNSEmbedsProps) {
  // Twitterスクリプトの読み込み
  useEffect(() => {
    if (xUrl) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charset = "utf-8";
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [xUrl]);

  // Instagramスクリプトの読み込み
  useEffect(() => {
    if (instagramUrl) {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [instagramUrl]);

  // URLが1つもない場合は表示しない
  if (!tiktokUrl && !xUrl && !youtubeUrl && !instagramUrl) {
    return null;
  }

  return (
    <section className="w-full bg-gradient-to-b from-background to-secondary/20 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-foreground">Follow Us on Social Media</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* TikTok */}
          {tiktokUrl && (
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-bold mb-6 text-foreground">TikTok</h3>
              <div className="w-full flex justify-center">
                <div className="w-full max-w-sm h-96 overflow-hidden rounded-lg shadow-lg">
                  <iframe
                    src={tiktokUrl}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* X (Twitter) */}
          {xUrl && (
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-bold mb-6 text-foreground">X</h3>
              <div className="w-full flex justify-center">
                <div className="w-full max-w-sm h-96 overflow-y-auto rounded-lg shadow-lg bg-white">
                  <blockquote className="twitter-tweet w-full" data-theme="light">
                    <a href={xUrl}></a>
                  </blockquote>
                </div>
              </div>
            </div>
          )}

          {/* YouTube */}
          {youtubeUrl && (
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-bold mb-6 text-foreground">YouTube</h3>
              <div className="w-full flex justify-center">
                <div className="w-full max-w-2xl">
                  <div className="relative w-full rounded-lg shadow-lg overflow-hidden" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                      src={youtubeUrl}
                      className="absolute top-0 left-0 w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instagram */}
          {instagramUrl && (
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-bold mb-6 text-foreground">Instagram</h3>
              <div className="w-full flex justify-center">
                <div className="w-full max-w-sm h-96 overflow-y-auto rounded-lg shadow-lg">
                  <blockquote
                    className="instagram-media"
                    data-instgrm-permalink={instagramUrl}
                    data-instgrm-version="14"
                    style={{
                      background: "#FFF",
                      border: "0",
                      borderRadius: "3px",
                      boxShadow:
                        "0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)",
                      margin: "1px",
                      maxWidth: "540px",
                      minWidth: "326px",
                      padding: "0",
                      width: "99.375%",
                    }}
                  >
                    <div style={{ padding: "16px" }}>
                      <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                        View this post on Instagram
                      </a>
                    </div>
                  </blockquote>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
