# Wedding Invitation — Next.js + Cloudflare D1

ලස්සන Wedding Invitation App එකක් — Next.js (App Router) + Cloudflare Workers + D1 Database.

## ✨ Features

- **Welcome Page** — background video: mobile වලදී `p.mp4`, desktop වලදී `l.mp4` (browser ම auto-select කරනවා), smooth autoplay + යට සිට උඩට dark red shadow overlay
- **Loading Screen** — `loc.png` couple illustration එක 3D float + glow pulse + shine sweep animation සමඟ, curtains විවෘත වීම, background video එක දිගටම play වෙනවා
- **Invitation Page** — calendar, countdown, times, venue + map, Poruwa timeline, rich Details section
- **Background Music** — generative romantic piano + strings + music-box soundtrack (Web Audio, reverb සමඟ) + mute button
- **About Button** — website උඩ දකුණේ; popup එකේ Design By JGS Lanka Co. + WhatsApp (+94 70 200 1859) + www.jgslanka.com
- **Admin Dashboard** — හැම invitation detail එකක්ම edit කරන්න පුළුවන්. Visitor count පෙන්වනවා
  - හැම page එකේම යට වම් පැත්තේ තියෙන සැඟවුණු **"get act"** button එක click කරලා PIN එක දීන්න: `JGS234-56JH`

## 🚀 Local Development

```bash
npm install
npm run db:migrate:local   # local D1 database එකට tables + default data හදනවා
npm run dev                # http://localhost:3000
```

## 🌍 Deploy to Cloudflare

1. D1 database එක create කරන්න:
   ```bash
   npx wrangler d1 create wedding-db
   ```
2. Output එකේ එන `database_id` එක `wrangler.jsonc` එකේ `database_id` field එකට දාන්න.
3. Remote database එකට migrate කරන්න:
   ```bash
   npm run db:migrate:remote
   ```
4. Deploy:
   ```bash
   npm run deploy
   ```

## 🔐 Admin

- PIN: `JGS234-56JH` (වෙනස් කරන්න නම් `wrangler.jsonc` එකේ `vars.ADMIN_PIN` වෙනස් කරන්න)
- Edit කරන්න පුළුවන්: names, date, times, message, venue, map, timeline steps, details lines, RSVP/WhatsApp numbers

## 📁 Structure

```
public/           p.mp4, l.mp4, loc.png (your media)
migrations/       D1 schema
src/app/          pages + API routes
src/components/   Welcome / Loading / Invitation / Admin UI
src/lib/          D1 access, auth, music engine, settings schema
```
