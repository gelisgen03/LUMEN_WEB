# LUMEN – Web sitesi

**LUMEN – Réseau Européen pour l'Apprentissage et la Modernisation Numérique** (Paris, loi 1901, RNA W751285790) derneğinin kurumsal sitesi.

Slogan: *Éclairer le chemin vers une Europe numérique, inclusive et durable.* / *Lighting the way to a digital, inclusive and sustainable Europe.*

Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · next-intl (FR varsayılan, EN) · MDX içerik · Vercel.
Veritabanı yok, çerez yok. Backend ileride eklenebilir (bkz. "Backend geldiğinde").

## Hızlı başlangıç

```bash
npm install
cp .env.example .env.local   # değerleri doldurun
npm run dev                  # http://localhost:3000 → /fr
npm run build && npm start   # production denemesi
```

## Sayfalar

| Yol | İçerik |
|---|---|
| `/` | Hero (fener ışığı + Avrupa ağı), kısa bilgi, 01 Biz kimiz + misyon/vizyon, 02 Ne üzerinde çalışıyoruz (6 tema), 03 Ne yapıyoruz (5 alan), 04 Yeşil çizgi, 05 Yöntem, 06 Projeler, 07 Değerler, 08 Ekip, çağrı |
| `/association` | Hikâye, tüzük amacı, misyon/vizyon, değerler, ekip, yasal bilgiler (RNA, JO yayını, merkez) |
| `/actions`, `/actions/[slug]` | 5 faaliyet alanı, 6 tema, formatlar, yöntem |
| `/projets`, `/projets/[slug]` | Hazırlık aşamasındaki örnek projeler (yeşil/dijital) |
| `/partenaires` | Be our partner: neden LUMEN, iş birliği türleri, adımlar, SSS, form |
| `/contact` | İletişim formu + e-posta / adres |
| `/mentions-legales`, `/confidentialite` | Yasal metinler |

## Tasarım konsepti: "Lumen = ışık"

- Renkler logodan: lacivert `#0F1E3D`, camgöbeği `#22C3E6`, altın `#F4B744`; sürdürülebilirlik vurgusu yeşil `#10B981`.
- Hero: Paris'te yanan bir fener ışığı, yavaş dönen ışınlar, Paris'ten Avrupa'ya çizilen ağ çizgileri, süzülen ışık zerreleri.
- Kartlar: fare nereye giderse orada yumuşak bir ışık yanar (`.spot`), kart hafifçe kalkar, ikon altına döner, görsel yakınlaşır.
- Kaydırınca bölümler sırayla belirir (`data-reveal`), sayılar sayarak gelir (`data-count`), başlıkta ilerleme çubuğu.
- Program şeridi (Erasmus+, ESC, CERV…) sonsuz kayar, üzerine gelince durur.
- Sidebar: her ekranda "Menu" düğmesiyle soldan açılan menü (mobilde ana menü). Ana sayfada geniş ekranlarda solda bölüm göstergesi, `/association`'da üstte bölüm çubuğu.
- Tüm animasyonlar yalnızca `transform`/`opacity` kullanır (GPU); `prefers-reduced-motion` açıksa kapanır.
- Karanlık mod: sistem tercihi + elle geçiş.

## Stil dosyaları

Tüm CSS `src/styles/` altında, konuya göre ayrılmış; giriş dosyası `index.css` (layout içinde bir kez import edilir):

| Dosya | İçerik |
|---|---|
| `tokens.css` | Renkler, fontlar, tip ölçeği, animasyon eğrileri ve süreleri (`--ease-smooth`, `--dur-*`) |
| `base.css` | html/body, başlıklar, focus, seçim |
| `motion.css` | Kaydırınca belirme, ortak keyframe'ler, "hareketi azalt" ayarı |
| `components.css` | Kart ışığı, buton parıltısı, link çizgisi, program şeridi, sidebar, SSS |
| `hero.css` | Hero ışık gösterisi: ışınlar, ağ, ışık darbeleri, parıltılar, kayan ışık |
| `sections.css` | "Nasıl çalışıyoruz" ışık akışı, sayaç rakamları, bölüm göstergesi lambaları |
| `prose.css` | MDX metinleri |

Animasyon hızını tek yerden değiştirmek için `tokens.css` içindeki `--dur-*` ve `--ease-smooth` değerlerini düzenleyin.

**Hareketi azalt:** İşletim sisteminde animasyonlar kapalıysa (Windows: Ayarlar → Erişilebilirlik → Görsel efektler → Animasyon efektleri) site tamamen durmaz; dönme, süzülme, fare takibi ve kayma kapanır, yerinde kalan hafif ışık efektleri (darbeler, parıltılar) devam eder.

## İçerik ekleme

Her içerik bir `.mdx` dosyasıdır (üstte frontmatter, altta metin). Önce `fr/` altına yazın; `en/` altında aynı adlı dosya yoksa İngilizce sitede Fransızca gösterilir. Eksik/yanlış alan build'i dosya yoluyla durdurur.

| Koleksiyon | Klasör | Zorunlu alanlar |
|---|---|---|
| Faaliyet alanı | `src/content/actions/{fr,en}/` | title, slug (5 alandan biri), order, icon, summary, image, audiences[], methods[] |
| Proje | `src/content/projects/{fr,en}/` | title, slug, summary, programme, status (`en-preparation`/`en-cours`/`termine`), domains[], sdgs[] (1–17), partners[] (boş olabilir), outcomes[], cover |
| Ekip | `src/content/team/{fr,en}/` | name, slug, order, role, title, bio (+ photo, linkedin) |

Arayüz metinleri, 6 tema, değerler, yöntem adımları, SSS: `messages/fr.json` ve `messages/en.json` (düz JSON; anahtarları değil yalnızca değerleri değiştirin).
İkon anahtarları: `src/components/ui/icons.tsx`. Dernek bilgileri (e-posta, adres, RNA): `src/lib/site.ts`.

Görseller `public/images/` altında (Unsplash lisansı, yerel ve optimize). Ekip fotoğrafları Cloudinary'den gelir (`next.config.ts` → `remotePatterns`). Logo: `public/brand/`.

## Dağıtım (Vercel)

1. Repoyu Vercel'e bağlayın.
2. Environment Variables: `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL` (ör. `reseau.numerique.eu@gmail.com`), `CONTACT_FROM_EMAIL` (Resend'de doğrulanmış alan adı).
3. Vercel Analytics'i açın (çerezsiz).

## Dikkat

- AB logosu/"Co-funded by the European Union" ibaresi yalnızca bir proje resmen finanse edildiğinde kullanılmalı. Şu an sitede yalnızca program adları ve genel AB bayrağı "programlar için tasarlandı" bağlamında var; yasal sayfada açıklama mevcut.
- Projeler "En préparation" olarak işaretli örnek kavramlardır; ortaklar belli oldukça `partners[]` doldurulmalı.
- OID numarası alınınca `messages/*.json` → `partner.faq` güncellenmeli.

## Backend geldiğinde

- `src/lib/content/index.ts` tek veri kapısıdır; imzaları koruyup içini API/CMS çağrısıyla değiştirin.
- `src/lib/rate-limit.ts` bellek içidir; paylaşımlı store'a (ör. Upstash Redis) geçin.
