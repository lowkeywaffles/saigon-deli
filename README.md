# Saigon Deli: website demo

Trilingual (English / Tiếng Việt / Español) demo website for Saigon Deli, 3341 W Walnut St #102, Garland, TX 75042 · (972) 272-3145.

- Single static page (`index.html`). `?lang=vi` or `?lang=es` for direct links.
- Rubber-stamp language switch (EN → VI → ES), paper-lantern light/dark switch, live open/closed status.

## Needed before going live
- [ ] Hours: listings disagree (8 AM–7 PM daily vs 8–8 with Wednesday closed)
- [ ] Full menu with prices (reviews mention $5 bánh mì and a buy-3-get-1-free deal; confirm before publishing)
- [ ] Photos of the sandwiches, counter and shop
- [ ] Which delivery apps they use (for "Order on DoorDash / Uber Eats" buttons)
- [ ] Do they bake their own bread? (great selling point if yes)
- [ ] Note: saigonvietnamdeli.com currently redirects to a spam site; worth mentioning in the pitch

## Stack
- **Next.js** (static export) + **TypeScript** + **Tailwind CSS v4**
- **Magic UI** (Marquee, MagicCard, BorderBeam), **Motion**, **GSAP**, **Lenis** smooth scroll, **Phosphor** icons
- Strings live in `src/content/strings.json` (English plus each translation); the page is `src/app/page.tsx`

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in out/
```
Pushing to `main` builds and deploys to GitHub Pages (`.github/workflows/pages.yml`).
