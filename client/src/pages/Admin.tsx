import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Upload, Trash2, Plus } from "lucide-react";

const ADMIN_PASSWORD = "5793"; // 引き継ぎメモより

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: siteConfig, refetch: refetchConfig } = trpc.site.getConfig.useQuery();
  const { data: allImages, refetch: refetchImages } = trpc.images.getAll.useQuery();
  const { data: snsLinks, refetch: refetchSns } = trpc.sns.getAll.useQuery();

  const updateConfig = trpc.site.updateConfig.useMutation();
  const uploadImage = trpc.images.upload.useMutation();
  const deleteImage = trpc.images.delete.useMutation();
  const addSnsLink = trpc.sns.add.useMutation();
  const updateSnsLink = trpc.sns.update.useMutation();
  const deleteSnsLink = trpc.sns.delete.useMutation();

  const fileInputRefs = {
    hero_pc: useRef<HTMLInputElement>(null),
    hero_sp: useRef<HTMLInputElement>(null),
    bg_pc: useRef<HTMLInputElement>(null),
    bg_sp: useRef<HTMLInputElement>(null),
    banner: useRef<HTMLInputElement>(null),
    salon_interior: useRef<HTMLInputElement>(null),
    gallery_1: useRef<HTMLInputElement>(null),
    gallery_2: useRef<HTMLInputElement>(null),
    gallery_3: useRef<HTMLInputElement>(null),
  };

  const [formData, setFormData] = useState({
    site_title: "",
    hero_subtitle: "",
    about_text_1: "",
    about_text_2: "",
    about_text_3: "",
    address: "",
    business_hours: "",
    closed_days: "",
    phone: "",
    contact_line: "",
    map_embed: "",
  });

  const [newSnsLink, setNewSnsLink] = useState({
    platform: "",
    url: "",
    displayName: "",
  });

  // ログイン処理
  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success("ログインしました");
      // フォームデータを初期化
      if (siteConfig) {
        setFormData({
          site_title: siteConfig.site_title || "",
          hero_subtitle: siteConfig.hero_subtitle || "",
          about_text_1: siteConfig.about_text_1 || "",
          about_text_2: siteConfig.about_text_2 || "",
          about_text_3: siteConfig.about_text_3 || "",
          address: siteConfig.address || "",
          business_hours: siteConfig.business_hours || "",
          closed_days: siteConfig.closed_days || "",
          phone: siteConfig.phone || "",
          contact_line: siteConfig.contact_line || "",
          map_embed: siteConfig.map_embed || "",
        });
      }
    } else {
      toast.error("パスワードが正しくありません");
    }
  };

  // 画像アップロード
  const handleImageUpload = async (category: string, file: File) => {
    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const base64Data = base64.split(',')[1];
        
        await uploadImage.mutateAsync({
          category,
          fileData: base64Data,
          fileName: file.name,
          mimeType: file.type,
          sortOrder: 0,
        });
        
        await refetchImages();
        toast.success("画像をアップロードしました");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("画像のアップロードに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  // 画像削除
  const handleImageDelete = async (id: number) => {
    setIsLoading(true);
    try {
      await deleteImage.mutateAsync({ id });
      await refetchImages();
      toast.success("画像を削除しました");
    } catch (error) {
      toast.error("画像の削除に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  // サイト設定保存
  const handleSaveConfig = async () => {
    setIsLoading(true);
    try {
      for (const [key, value] of Object.entries(formData)) {
        await updateConfig.mutateAsync({ key, value });
      }
      await refetchConfig();
      toast.success("設定を保存しました");
    } catch (error) {
      toast.error("設定の保存に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  // SNSリンク追加
  const handleAddSnsLink = async () => {
    if (!newSnsLink.platform || !newSnsLink.url) {
      toast.error("プラットフォームとURLを入力してください");
      return;
    }
    setIsLoading(true);
    try {
      await addSnsLink.mutateAsync({
        platform: newSnsLink.platform.toLowerCase(),
        url: newSnsLink.url,
        displayName: newSnsLink.displayName,
        sortOrder: snsLinks?.length || 0,
      });
      await refetchSns();
      setNewSnsLink({ platform: "", url: "", displayName: "" });
      toast.success("SNSリンクを追加しました");
    } catch (error) {
      toast.error("SNSリンクの追加に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  // SNSリンク削除
  const handleDeleteSnsLink = async (id: number) => {
    setIsLoading(true);
    try {
      await deleteSnsLink.mutateAsync({ id });
      await refetchSns();
      toast.success("SNSリンクを削除しました");
    } catch (error) {
      toast.error("SNSリンクの削除に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  // カテゴリ別の画像を取得
  const getImagesByCategory = (category: string) => {
    return allImages?.filter(img => img.category === category) || [];
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">管理画面ログイン</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4 text-center">
              環境変数 ADMIN_PASSWORD が "なければ" "5793"
            </p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="password">パスワード</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="パスワードを入力"
                />
              </div>
              <Button onClick={handleLogin} className="w-full">
                ログイン
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-2">SPICE Nail 管理画面</h1>
          <p className="text-center text-muted-foreground">サイトの設定と画像を管理できます</p>
        </div>

        {/* サイト情報設定 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>サイト情報設定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="site_title">サイトタイトル</Label>
                <Input
                  id="site_title"
                  value={formData.site_title}
                  onChange={(e) => setFormData({ ...formData, site_title: e.target.value })}
                  placeholder="SPICE Nail"
                />
              </div>
              <div>
                <Label htmlFor="hero_subtitle">ヒーローサブタイトル</Label>
                <Input
                  id="hero_subtitle"
                  value={formData.hero_subtitle}
                  onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                  placeholder="あなたの指先に、特別な輝きを"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="about_text_1">About テキスト 1</Label>
              <Textarea
                id="about_text_1"
                value={formData.about_text_1}
                onChange={(e) => setFormData({ ...formData, about_text_1: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="about_text_2">About テキスト 2</Label>
              <Textarea
                id="about_text_2"
                value={formData.about_text_2}
                onChange={(e) => setFormData({ ...formData, about_text_2: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="about_text_3">About テキスト 3</Label>
              <Textarea
                id="about_text_3"
                value={formData.about_text_3}
                onChange={(e) => setFormData({ ...formData, about_text_3: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address">住所</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="東京都渋谷区〇〇 1-2-3"
                />
              </div>
              <div>
                <Label htmlFor="phone">電話番号</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="03-XXXX-XXXX"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="business_hours">営業時間</Label>
                <Input
                  id="business_hours"
                  value={formData.business_hours}
                  onChange={(e) => setFormData({ ...formData, business_hours: e.target.value })}
                  placeholder="10:00 - 20:00"
                />
              </div>
              <div>
                <Label htmlFor="closed_days">定休日</Label>
                <Input
                  id="closed_days"
                  value={formData.closed_days}
                  onChange={(e) => setFormData({ ...formData, closed_days: e.target.value })}
                  placeholder="毎週月曜日"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="contact_line">LINE / DM 案内</Label>
              <Input
                id="contact_line"
                value={formData.contact_line}
                onChange={(e) => setFormData({ ...formData, contact_line: e.target.value })}
                placeholder="公式LINEまたはInstagram DMよりご連絡ください"
              />
            </div>

            <div>
              <Label htmlFor="map_embed">Googleマップ埋め込みURL</Label>
              <Input
                id="map_embed"
                value={formData.map_embed}
                onChange={(e) => setFormData({ ...formData, map_embed: e.target.value })}
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Googleマップで「共有」→「地図を埋め込む」からiframeのsrc URLをコピー
              </p>
            </div>

            <Button onClick={handleSaveConfig} disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              設定を保存
            </Button>
          </CardContent>
        </Card>

        {/* 画像管理 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>画像管理</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* ヒーロー画像 */}
            <div>
              <h3 className="font-semibold mb-4">トップ画像（ヒーロー）</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {['hero_pc', 'hero_sp'].map((category) => {
                  const images = getImagesByCategory(category);
                  const label = category === 'hero_pc' ? 'PC用（推奨: 1800×800px）' : 'スマホ用（推奨: 1000×1000px）';
                  return (
                    <div key={category}>
                      <Label>{label}</Label>
                      <div className="mt-2 space-y-2">
                        {images.map((img) => (
                          <div key={img.id} className="relative">
                            <img src={img.url} alt={category} className="w-full h-40 object-cover rounded" />
                            <Button
                              size="sm"
                              variant="destructive"
                              className="absolute top-2 right-2"
                              onClick={() => handleImageDelete(img.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <input
                          ref={fileInputRefs[category as keyof typeof fileInputRefs]}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(category, file);
                          }}
                        />
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => fileInputRefs[category as keyof typeof fileInputRefs].current?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          画像をアップロード
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 背景画像 */}
            <div>
              <h3 className="font-semibold mb-4">背景画像</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {['bg_pc', 'bg_sp'].map((category) => {
                  const images = getImagesByCategory(category);
                  const label = category === 'bg_pc' ? 'PC用背景' : 'スマホ用背景';
                  return (
                    <div key={category}>
                      <Label>{label}</Label>
                      <div className="mt-2 space-y-2">
                        {images.map((img) => (
                          <div key={img.id} className="relative">
                            <img src={img.url} alt={category} className="w-full h-40 object-cover rounded" />
                            <Button
                              size="sm"
                              variant="destructive"
                              className="absolute top-2 right-2"
                              onClick={() => handleImageDelete(img.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <input
                          ref={fileInputRefs[category as keyof typeof fileInputRefs]}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(category, file);
                          }}
                        />
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => fileInputRefs[category as keyof typeof fileInputRefs].current?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          画像をアップロード
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* その他の画像 */}
            <div>
              <h3 className="font-semibold mb-4">その他の画像</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {['salon_interior', 'gallery_1', 'gallery_2', 'gallery_3'].map((category) => {
                  const images = getImagesByCategory(category);
                  const labels: Record<string, string> = {
                    salon_interior: 'サロン内装',
                    gallery_1: 'ギャラリー1',
                    gallery_2: 'ギャラリー2',
                    gallery_3: 'ギャラリー3',
                  };
                  return (
                    <div key={category}>
                      <Label>{labels[category]}</Label>
                      <div className="mt-2 space-y-2">
                        {images.map((img) => (
                          <div key={img.id} className="relative">
                            <img src={img.url} alt={category} className="w-full h-40 object-cover rounded" />
                            <Button
                              size="sm"
                              variant="destructive"
                              className="absolute top-2 right-2"
                              onClick={() => handleImageDelete(img.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <input
                          ref={fileInputRefs[category as keyof typeof fileInputRefs]}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(category, file);
                          }}
                        />
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => fileInputRefs[category as keyof typeof fileInputRefs].current?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          画像をアップロード
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* バナー画像 */}
            <div>
              <h3 className="font-semibold mb-4">スライドバナー</h3>
              <div className="space-y-2">
                {getImagesByCategory('banner').map((img) => (
                  <div key={img.id} className="relative">
                    <img src={img.url} alt="banner" className="w-full h-40 object-cover rounded" />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => handleImageDelete(img.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <input
                  ref={fileInputRefs.banner}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload('banner', file);
                  }}
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRefs.banner.current?.click()}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  バナーを追加
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SNSリンク管理 */}
        <Card>
          <CardHeader>
            <CardTitle>SNSリンク管理</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {snsLinks?.map((link) => (
                <div key={link.id} className="flex items-center gap-2 p-3 bg-secondary/50 rounded">
                  <div className="flex-1">
                    <p className="font-semibold capitalize">{link.platform}</p>
                    <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteSnsLink(link.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">新しいSNSリンクを追加</h4>
              <div className="grid md:grid-cols-3 gap-3">
                <select
                  value={newSnsLink.platform}
                  onChange={(e) => setNewSnsLink({ ...newSnsLink, platform: e.target.value })}
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
                >
                  <option value="">プラットフォームを選択</option>
                  <option value="tiktok">TikTok</option>
                  <option value="x">X (Twitter)</option>
                  <option value="youtube">YouTube</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                </select>
                <Input
                  placeholder="URL"
                  value={newSnsLink.url}
                  onChange={(e) => setNewSnsLink({ ...newSnsLink, url: e.target.value })}
                />
                <Button onClick={handleAddSnsLink} disabled={isLoading}>
                  <Plus className="mr-2 h-4 w-4" />
                  追加
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
