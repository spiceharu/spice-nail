import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Facebook, Twitter, MapPin, Phone, Clock } from "lucide-react";
import { APP_TITLE } from "@/const";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import SlideBannerCarousel from "@/components/SlideBannerCarousel";
import SNSEmbeds from "@/components/SNSEmbeds";

export default function Home() {
  const { data: siteConfig } = trpc.site.getConfig.useQuery();
  const { data: allImages } = trpc.images.getAll.useQuery();
  const { data: snsLinks } = trpc.sns.getAll.useQuery();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  // 画像をカテゴリ別に取得
  const getImageUrl = (category: string) => {
    const categoryImages = allImages?.filter(img => img.category === category) || [];
    return categoryImages.length > 0 ? categoryImages[0]?.url : '';
  };

  const heroImage = isMobile ? getImageUrl('hero_sp') : getImageUrl('hero_pc');
  const bgImage = isMobile ? getImageUrl('bg_sp') : getImageUrl('bg_pc');
  const bannerImages = allImages?.filter(img => img.category === 'banner') || [];
  const salonImage = getImageUrl('salon_interior');

  // 背景画像スタイル
  const backgroundStyle = bgImage ? {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  } : {};

  return (
    <div className="min-h-screen" style={backgroundStyle}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">{siteConfig?.site_title || APP_TITLE}</h1>
            <div className="hidden md:flex gap-6">
              <button onClick={() => scrollToSection('about')} className="text-foreground hover:text-primary transition-colors">
                About
              </button>
              <button onClick={() => scrollToSection('menu')} className="text-foreground hover:text-primary transition-colors">
                Menu
              </button>
              <button onClick={() => scrollToSection('gallery')} className="text-foreground hover:text-primary transition-colors">
                Gallery
              </button>
              <button onClick={() => scrollToSection('access')} className="text-foreground hover:text-primary transition-colors">
                Access
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-foreground hover:text-primary transition-colors">
                Contact
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {heroImage ? (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${heroImage})`,
              filter: 'brightness(0.7)'
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-purple-300" style={{ filter: 'brightness(0.7)' }} />
        )}
        <div className="relative z-10 text-center text-white px-4">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
            {siteConfig?.site_title || APP_TITLE}
          </h2>
          <p className="text-xl md:text-2xl mb-8 drop-shadow-md">
            {siteConfig?.hero_subtitle || 'あなたの指先に、特別な輝きを'}
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
            onClick={() => scrollToSection('contact')}
          >
            ご予約はこちら
          </Button>
        </div>
      </section>

      {/* Banner Carousel */}
      {bannerImages.length > 0 && (
        <SlideBannerCarousel 
          banners={bannerImages.map(banner => ({
            id: banner.id,
            imageUrl: banner.url,
            alt: 'banner'
          }))}
          autoPlayInterval={3000}
        />
      )}

      {/* About Section */}
      <section id="about" className="py-20 bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-foreground">About SPICE</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {salonImage && (
                <div>
                  <img 
                    src={salonImage} 
                    alt="サロン内装" 
                    className="rounded-lg shadow-xl w-full h-auto object-cover"
                  />
                </div>
              )}
              <div className="space-y-4">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {siteConfig?.about_text_1 || 'SPICEは、お客様一人ひとりの個性を大切にし、丁寧な施術とデザイン提案で理想のネイルを実現するネイルサロンです。'}
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {siteConfig?.about_text_2 || '清潔で落ち着いた空間で、リラックスしながら上質なネイルケアをお楽しみいただけます。経験豊富なネイリストが、あなたの指先を美しく彩ります。'}
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {siteConfig?.about_text_3 || 'トレンドを取り入れたデザインから、シンプルで上品なスタイルまで、幅広いご要望にお応えいたします。'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-20 bg-secondary/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">Menu & Price</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="hover:shadow-xl transition-shadow bg-background/90">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-4 text-primary">ジェルネイル</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-foreground">ワンカラー</span>
                    <span className="font-semibold text-foreground">¥6,000</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-foreground">グラデーション</span>
                    <span className="font-semibold text-foreground">¥7,000</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-foreground">フレンチ</span>
                    <span className="font-semibold text-foreground">¥7,500</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground">デザインアート</span>
                    <span className="font-semibold text-foreground">¥8,000〜</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow bg-background/90">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-4 text-primary">ケアメニュー</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-foreground">ハンドケア</span>
                    <span className="font-semibold text-foreground">¥4,000</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-foreground">フットケア</span>
                    <span className="font-semibold text-foreground">¥5,000</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-foreground">角質ケア</span>
                    <span className="font-semibold text-foreground">¥3,500</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground">保湿トリートメント</span>
                    <span className="font-semibold text-foreground">¥2,500</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow bg-background/90">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-4 text-primary">オプション</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-foreground">ストーン（1粒）</span>
                    <span className="font-semibold text-foreground">¥100〜</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-foreground">パール（1粒）</span>
                    <span className="font-semibold text-foreground">¥150〜</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-foreground">ラメグラデーション</span>
                    <span className="font-semibold text-foreground">¥1,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground">長さ出し（1本）</span>
                    <span className="font-semibold text-foreground">¥500</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">Gallery</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[1, 2, 3].map((num) => {
              const galleryImage = getImageUrl(`gallery_${num}`);
              return (
                <div key={num} className="overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
                  {galleryImage ? (
                    <img 
                      src={galleryImage} 
                      alt={`ネイルデザイン${num}`} 
                      className="w-full h-80 object-cover hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-80 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                      <p className="text-muted-foreground">画像を設定してください</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-center mt-8 text-muted-foreground">
            最新のデザインはInstagramでもご覧いただけます
          </p>
        </div>
      </section>

      {/* Access Section */}
      <section id="access" className="py-20 bg-secondary/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">Access</h2>
          <div className="max-w-3xl mx-auto">
            <Card className="bg-background/90">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      店舗情報
                    </h3>
                    <div className="space-y-3 text-muted-foreground">
                      <p className="flex items-start gap-2">
                        <span className="font-medium text-foreground min-w-20">住所:</span>
                        <span>{siteConfig?.address || '東京都渋谷区〇〇 1-2-3 〇〇ビル 3F'}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-foreground" />
                        <span className="font-medium text-foreground">営業時間:</span>
                        <span>{siteConfig?.business_hours || '10:00 - 20:00'}</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="font-medium text-foreground min-w-20">定休日:</span>
                        <span>{siteConfig?.closed_days || '毎週月曜日'}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-foreground" />
                        <span className="font-medium text-foreground">電話:</span>
                        <span>{siteConfig?.phone || '03-XXXX-XXXX'}</span>
                      </p>
                    </div>
                  </div>
                  {siteConfig?.map_embed && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-primary">地図</h3>
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <iframe 
                          src={siteConfig.map_embed}
                          width="100%" 
                          height="100%" 
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">Contact & Reservation</h2>
          <div className="max-w-2xl mx-auto text-center">
            <Card className="bg-background/90">
              <CardContent className="p-8">
                <p className="text-lg mb-6 text-muted-foreground">
                  ご予約は以下の方法で承っております
                </p>
                <div className="space-y-4">
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <p className="font-semibold text-foreground mb-2">LINE / DM</p>
                    <p className="text-sm text-muted-foreground">
                      {siteConfig?.contact_line || '公式LINEまたはInstagram DMよりご連絡ください'}
                    </p>
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <p className="font-semibold text-foreground mb-2">お電話</p>
                    <p className="text-sm text-muted-foreground">
                      {siteConfig?.phone || '03-XXXX-XXXX'}（営業時間内）
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-6">
                  ※ご予約の際は、ご希望の日時とメニューをお伝えください
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SNS Embeds Section */}
      <SNSEmbeds 
        tiktokUrl={snsLinks?.find(link => link.platform === 'tiktok')?.url}
        xUrl={snsLinks?.find(link => link.platform === 'x')?.url}
        youtubeUrl={snsLinks?.find(link => link.platform === 'youtube')?.url}
        instagramUrl={snsLinks?.find(link => link.platform === 'instagram')?.url}
      />

      {/* SNS Links Footer */}
      {snsLinks && snsLinks.length > 0 && (
        <section className="py-16 bg-primary/5 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Follow Us</h2>
            <div className="flex justify-center gap-6">
              {snsLinks.map((link) => {
                const Icon = link.platform === 'instagram' ? Instagram : 
                            link.platform === 'facebook' ? Facebook : Twitter;
                return (
                  <a 
                    key={link.id}
                    href={link.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                    aria-label={link.platform}
                  >
                    <Icon size={24} />
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 bg-foreground/5 border-t border-border backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">© {new Date().getFullYear()} {siteConfig?.site_title || APP_TITLE}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
