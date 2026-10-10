"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Armchair, Bread, Coins, Leaf, MapPin, NavigationArrow, Phone } from "@phosphor-icons/react";
import { BorderBeam } from "@/components/ui/border-beam";
import { MagicCard } from "@/components/ui/magic-card";
import { Marquee } from "@/components/ui/marquee";
import { Reveal, Wrap, flipTheme, type Hours } from "@/components/kit";
import { Faq, HoursTable, MapFrame, useDark, useStatus } from "@/components/blocks";
import { LANGS, T, useLang, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

const TEL = "tel:+19722723145", PHONE = "(972) 272-3145";
const DIR = "https://www.google.com/maps/dir/?api=1&destination=3341+W+Walnut+St+102+Garland+TX+75042";
// Listings disagree (8-7 daily vs 8-8 with Wednesday closed); confirm with the owner.
const HOURS: Hours = { 0: [8, 19], 1: [8, 19], 2: [8, 19], 3: [8, 19], 4: [8, 19], 5: [8, 19], 6: [8, 19] };
const ORDER = ["en", "vi", "es"];
const TICK: Record<string, string[]> = {
  en: ["Bánh mì", "Pâté pork rolls", "Avocado smoothies", "Dine in", "Take out", "Delivery"],
  vi: ["Bánh mì", "Bánh patê sô", "Sinh tố bơ", "Ăn tại chỗ", "Mang đi", "Giao hàng"],
  es: ["Bánh mì", "Rollos de paté", "Licuados de aguacate", "Para comer aquí", "Para llevar", "A domicilio"],
};
const LBL: Record<string, { lang: string; theme: string }> = {
  en: { lang: "Language: English. Switch to Tiếng Việt", theme: "Toggle dark mode" },
  vi: { lang: "Ngôn ngữ: Tiếng Việt. Chuyển sang Español", theme: "Bật/tắt chế độ tối" },
  es: { lang: "Idioma: Español. Switch to English", theme: "Cambiar modo oscuro" },
};
const MENU = [
  { k: "i1", vn: "Bánh mì đặc biệt" }, { k: "i2", vn: "Bánh mì xíu mại" }, { k: "i3", vn: "Bánh mì thịt nguội" },
];
const MORE = [
  { k: "i4", vn: "Bánh patê sô" }, { k: "i5", vn: "Sinh tố bơ" }, { k: "i6", vn: "Nước uống & chè" },
];
const WHY = [["w1", Bread], ["w2", Leaf], ["w3", Coins], ["w4", Armchair]] as const;

const btn = "inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-[15px] font-extrabold transition-[transform,background-color] duration-300 ease-spring hover:-translate-y-0.5 active:scale-[.97]";
const primary = cn(btn, "bg-herb text-white shadow-[inset_0_1px_0_rgba(255,255,255,.25),0_14px_30px_-14px_var(--herb)] dark:text-[#06180e]");
const ghost = cn(btn, "bg-card text-ink shadow-[inset_0_0_0_1px_var(--line)]");
const eyebrow = "mb-3 block text-[13px] font-extrabold tracking-[.14em] text-chilitext uppercase";

/** Language: a red rubber stamp that thuds down on each change, EN to VI to ES. */
function Stamp() {
  const { lang, setLang } = useLang();
  const next = ORDER[(ORDER.indexOf(lang) + 1) % ORDER.length];
  return (
    <button type="button" onClick={() => setLang(next)} aria-label={(LBL[lang] ?? LBL.en).lang} className="relative size-[52px] flex-none cursor-pointer rounded-full">
      <span key={lang} className="thud absolute inset-[3px] grid -rotate-12 place-items-center rounded-full border-[2.5px] border-chilitext text-[15px] font-black tracking-[.04em] text-chilitext before:absolute before:inset-[3px] before:rounded-full before:border before:border-dashed before:border-chilitext/60">
        {lang.toUpperCase()}<small className="absolute bottom-[7px] text-[6.5px] font-extrabold tracking-[.12em]">→ {next.toUpperCase()}</small>
      </span>
    </button>
  );
}

/** Theme: a paper lantern that swings and lights up at night. */
function Lantern() {
  const { dark, setTheme } = useDark();
  const { lang } = useLang();
  const [n, setN] = useState(0);
  return (
    <button type="button" aria-label={(LBL[lang] ?? LBL.en).theme} aria-pressed={dark}
      onClick={e => { setN(x => x + 1); flipTheme(e.currentTarget, () => flushSync(() => setTheme(dark ? "light" : "dark"))); }}
      className="h-[54px] w-10 flex-none cursor-pointer">
      <svg key={n} viewBox="0 0 40 54" className={cn("size-full overflow-visible", n && "swing")} aria-hidden="true">
        <path d="M20 0v6" stroke="#c99a3a" strokeWidth="1.5" />
        <rect x="14" y="6" width="12" height="4" rx="1" fill="#c99a3a" />
        <ellipse cx="20" cy="26" rx="15" ry="16" className="transition-[fill,filter] duration-500" fill={dark ? "#ff6a3d" : "#e03b2f"} style={{ filter: dark ? "drop-shadow(0 0 10px var(--glow))" : "none" }} />
        <path d="M8 26h24M10 18h20M10 34h20" stroke="#000" strokeOpacity=".12" />
        <ellipse cx="20" cy="26" rx="7" ry="9" fill="#ffd27a" className="transition-opacity duration-500" style={{ opacity: dark ? 0.9 : 0 }} />
        <rect x="14" y="41" width="12" height="4" rx="1" fill="#c99a3a" />
        <path d="M17 45v6M20 45v8M23 45v6" stroke="#e03b2f" strokeWidth="1.2" />
      </svg>
    </button>
  );
}

/** The bánh mì builds itself: bread, then each filling slides in, then the top crust lands. */
function Sandwich() {
  const ref = useRef<HTMLDivElement>(null);
  const t = useT();
  useGSAP(() => {
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
      gsap.timeline({ delay: 0.3, defaults: { ease: "back.out(1.6)", duration: 0.7 } })
        .from(".l-back", { y: 40, opacity: 0 })
        .from(".l-fill", { x: -60, opacity: 0, stagger: 0.12 }, "-=0.3")
        .from(".l-dot", { scale: 0, transformOrigin: "50% 50%", stagger: 0.06 }, "-=0.2")
        .from(".l-top", { y: -70, opacity: 0, ease: "bounce.out", duration: 0.9 }, "-=0.1")
        .from(".l-herb", { scale: 0, rotate: -40, transformOrigin: "50% 100%", stagger: 0.08 }, "-=0.3")
        .from(".sticker", { scale: 0, rotate: -90, ease: "back.out(2)" }, "-=0.2");
    });
  }, { scope: ref });
  return (
    <div ref={ref} className="relative aspect-[1.15]" aria-hidden="true">
      <div className="absolute inset-[6%_8%] rounded-full bg-tint" />
      <svg viewBox="0 0 400 340" className="bob absolute inset-0 size-full">
        <path className="l-back" d="M28 196c10-70 300-110 344-46 14 22-10 46-52 58-80 22-260 40-292-12z" fill="#c98636" />
        <path className="l-fill" d="M44 194c40-12 250-56 316-54" stroke="#4fa84a" strokeWidth="22" strokeLinecap="round" fill="none" />
        <path className="l-fill" d="M52 188c60-14 220-50 300-52" stroke="#f08a3a" strokeWidth="9" strokeLinecap="round" fill="none" strokeDasharray="24 10" />
        <path className="l-fill" d="M56 200c80-16 220-48 296-50" stroke="#c94a3c" strokeWidth="12" strokeLinecap="round" fill="none" strokeDasharray="40 8" />
        <path className="l-fill" d="M60 182c60-12 200-44 288-48" stroke="#9fd18b" strokeWidth="7" strokeLinecap="round" fill="none" strokeDasharray="14 12" />
        <g fill="#e03b2f"><circle className="l-dot" cx="120" cy="170" r="5" /><circle className="l-dot" cx="210" cy="152" r="5" /><circle className="l-dot" cx="290" cy="140" r="5" /></g>
        <g className="l-top">
          <path d="M34 206c-2 40 70 54 160 44 100-12 190-40 180-90-4 26-60 46-150 60-90 14-160 6-190-14z" fill="#e2a24d" />
          <path d="M110 236l26-16M180 228l26-18M250 214l26-18M316 194l22-16" stroke="#fbe2b0" strokeWidth="5" strokeLinecap="round" opacity=".9" />
        </g>
        <g fill="#2f8a43"><path className="l-herb" d="M150 150c-6-16 6-26 16-22-2 12-6 18-16 22z" /><path className="l-herb" d="M250 132c-4-16 8-24 18-20-2 12-8 16-18 20z" /><path className="l-herb" d="M320 126c-2-14 10-20 18-16-2 10-8 14-18 16z" /></g>
      </svg>
      <div className="sticker absolute top-[4%] right-[6%] grid size-28 place-items-center rounded-full bg-chili p-3 text-center text-[15px] leading-tight font-black text-white shadow-[0_18px_30px_-12px_rgba(224,59,47,.6)] max-sm:size-24 max-sm:text-[13px] rtl:right-auto rtl:left-[6%]">
        <span className="spin absolute inset-1.5 rounded-full border-[1.5px] border-dashed border-white/60" />
        <span dangerouslySetInnerHTML={{ __html: t("sticker") }} />
      </div>
    </div>
  );
}

function Item({ k, vn }: { k: string; vn: string }) {
  return (
    <div className="group grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1 border-b border-dashed border-line py-4 last:border-b-0">
      <T k={k} as="b" className="text-[18px] font-extrabold transition-colors group-hover:text-herbtext" />
      <span lang="vi" className="text-end text-[13px] font-semibold text-herbtext">{vn}</span>
      <T k={`${k}d`} as="i" className="text-sm text-soft not-italic" />
    </div>
  );
}

export default function Home() {
  const t = useT();
  const { lang } = useLang();
  const status = useStatus(HOURS);

  return (
    <>
      <header className="pointer-events-none sticky top-3 z-40 px-4">
        <nav className="glass pointer-events-auto mx-auto flex h-[72px] max-w-[1160px] items-center justify-between gap-3 rounded-full border border-line ps-3 pe-3 shadow-[inset_0_1px_0_var(--hi),0_20px_50px_-28px_var(--shadow)]">
          <a href="#top" className="flex flex-none items-center gap-2.5" aria-label="Saigon Deli">
            <span className="grid size-11 place-items-center rounded-full bg-herb"><Bread size={24} weight="fill" color="#fbe2b0" /></span>
            <span><b className="block text-[21px] leading-none font-black tracking-tight">Saigon Deli</b><T k="logoSub" className="mt-0.5 block text-xs font-semibold text-soft max-sm:hidden" /></span>
          </a>
          <div className="flex items-center gap-1 text-[15px] font-semibold max-[900px]:hidden">
            {[["menu", "navMenu"], ["visit", "navVisit"]].map(([id, k]) => <a key={id} href={`#${id}`} className="rounded-full px-4 py-2 text-soft transition-colors hover:bg-bg2 hover:text-ink" dangerouslySetInnerHTML={{ __html: t(k) }} />)}
          </div>
          <div className="flex items-center gap-2.5">
            <Stamp /><Lantern />
            <a href={TEL} className={cn(primary, "px-5 py-2.5 max-sm:hidden")}><Phone size={17} weight="bold" />{PHONE}</a>
          </div>
        </nav>
      </header>

      <main id="top">
        <section className="relative overflow-hidden pt-16 pb-24 max-sm:pt-10">
          <Wrap className="grid grid-cols-2 items-center gap-12 max-[960px]:grid-cols-1">
            <div>
              <Reveal>
                <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-card px-3.5 py-1.5 text-sm font-semibold shadow-[inset_0_0_0_1px_var(--line)]">
                  <i className={cn("size-2 rounded-full", status.open ? "bg-[#22a35a] shadow-[0_0_0_4px_rgba(34,163,90,.2)]" : "bg-[#9aa59d]")} />{status.text || " "}
                </span>
              </Reveal>
              <Reveal delay={0.08}><T k="heroTitle" as="h1" className="mb-6 text-[clamp(50px,7vw,96px)] [&_.red]:text-chilitext [&_em]:text-herbtext" /></Reveal>
              <Reveal delay={0.16}><T k="heroLead" as="p" className="mb-8 max-w-[48ch] text-lg text-soft" /></Reveal>
              <Reveal delay={0.24} className="mb-7 flex flex-wrap gap-3">
                <a href={TEL} className={primary}><Phone size={18} weight="bold" /><T k="ctaCall" /></a>
                <a href={DIR} target="_blank" rel="noopener" className={ghost}><NavigationArrow size={18} weight="bold" /><T k="ctaDir" /></a>
              </Reveal>
              <Reveal delay={0.3} className="flex items-center gap-2.5 text-sm text-soft"><span className="tracking-[2px] text-[#e5a020]">★★★★☆</span><T k="rating" className="[&_b]:text-base [&_b]:text-ink" /></Reveal>
            </div>
            <Reveal delay={0.1} className="w-full max-w-[560px] justify-self-end max-[960px]:justify-self-center"><Sandwich /></Reveal>
          </Wrap>
        </section>

        <div className="bg-herb py-4 text-white dark:text-[#06180e]" aria-hidden="true">
          <Marquee className="[--duration:30s] [--gap:2.75rem]">
            {(TICK[lang] ?? TICK.en).map(w => <span key={w} className="flex items-center gap-11 text-lg font-extrabold">{w}<i className="size-2 rotate-45 bg-crust" /></span>)}
          </Marquee>
        </div>

        <section id="menu" className="scroll-mt-24 py-32 max-sm:py-20">
          <Wrap>
            <Reveal className="mb-14 max-w-[720px]"><T k="menuEyebrow" className={eyebrow} /><T k="menuTitle" as="h2" className="mb-4 text-[clamp(44px,5.6vw,76px)]" /><T k="menuLead" as="p" className="max-w-[58ch] text-[17px] text-soft" /></Reveal>
            <div className="grid grid-cols-[1.2fr_.8fr] items-start gap-6 max-[960px]:grid-cols-1">
              <Reveal className="ticket-edge relative overflow-hidden rounded-[22px] bg-card p-9 shadow-[inset_0_0_0_1px_var(--line),0_40px_80px_-50px_var(--shadow)] max-sm:p-6">
                <BorderBeam size={200} duration={11} colorFrom="#e03b2f" colorTo="#d99a45" borderWidth={1.5} />
                <T k="bmTitle" as="h3" className="mb-1 text-[34px]" /><T k="bmSub" as="p" className="mb-4 text-sm text-soft" />
                {MENU.map(m => <Item key={m.k} {...m} />)}
                <T k="bmNote" as="p" className="mt-4 rounded-xl bg-tint px-3.5 py-3 text-[13.5px] text-soft" />
              </Reveal>
              <Reveal delay={0.08} className="ticket-edge rounded-[22px] bg-card p-7 shadow-[inset_0_0_0_1px_var(--line)] max-sm:p-6">
                <T k="moreTitle" as="h3" className="mb-2 text-[26px]" />
                {MORE.map(m => <Item key={m.k} {...m} />)}
              </Reveal>
            </div>
          </Wrap>
        </section>

        <section className="bg-bg2 py-32 max-sm:py-20 [--edge:var(--bg-2)]">
          <Wrap>
            <Reveal className="mb-12 max-w-[720px]"><T k="whyEyebrow" className={eyebrow} /><T k="whyTitle" as="h2" className="text-[clamp(44px,5.6vw,76px)]" /></Reveal>
            <div className="grid grid-cols-4 gap-4 max-[960px]:grid-cols-2 max-sm:grid-cols-1">
              {WHY.map(([k, Icon], i) => (
                <Reveal key={k} delay={i * 0.06} className={cn("rounded-[24px] bg-card p-1.5 shadow-[inset_0_0_0_1px_var(--line)]", i % 2 && "lg:translate-y-8")}>
                  <MagicCard gradientSize={220} gradientColor="rgba(31,107,69,.1)" gradientFrom="#5cc58f" gradientTo="#e03b2f" className="h-full rounded-[19px] [&>div:last-child]:h-full">
                    <div className="h-full p-6">
                      <span className="mb-8 grid size-12 place-items-center rounded-2xl bg-tint text-herbtext"><Icon size={26} weight="duotone" /></span>
                      <T k={`${k}t`} as="h3" className="mb-1.5 text-[24px] tracking-tight" />
                      <T k={`${k}p`} as="p" className="text-[15px] text-soft" />
                    </div>
                  </MagicCard>
                </Reveal>
              ))}
            </div>
          </Wrap>
        </section>

        <section id="visit" className="scroll-mt-24 py-32 max-sm:py-20">
          <Wrap>
            <Reveal className="mb-12"><T k="visitEyebrow" className={eyebrow} /><T k="visitTitle" as="h2" className="text-[clamp(44px,5.6vw,76px)]" /></Reveal>
            <div className="grid grid-cols-[.9fr_1.1fr] gap-5 max-[960px]:grid-cols-1">
              <Reveal className="bezel rounded-[26px]">
                <div className="grid h-full content-start gap-5 rounded-[21px] bg-card p-8 shadow-[inset_0_1px_0_var(--hi)]">
                  <T k="hoursTitle" as="h3" className="text-[32px]" />
                  <HoursTable hours={HOURS} accent="text-herbtext font-extrabold" />
                  {([[TEL, Phone, PHONE, "callSub"], [DIR, MapPin, "3341 W Walnut St #102", null]] as const).map(([href, I, strong, sub]) => (
                    <a key={strong} href={href} target={sub ? undefined : "_blank"} rel="noopener" className="group flex items-start gap-3.5">
                      <span className="grid size-11 flex-none place-items-center rounded-xl bg-tint text-herbtext transition-transform duration-300 ease-spring group-hover:scale-110"><I size={20} weight="bold" /></span>
                      <span><strong className="block">{strong}</strong>{sub ? <T k={sub} className="text-sm text-soft" /> : <span className="text-sm text-soft">Garland, TX 75042</span>}</span>
                    </a>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.08} className="bezel min-h-[420px] overflow-hidden rounded-[26px]"><MapFrame q="3341+W+Walnut+St+102,+Garland,+TX+75042" className="min-h-[408px] rounded-[21px]" /></Reveal>
            </div>
          </Wrap>
        </section>

        <section className="bg-bg2 py-32 max-sm:py-20">
          <Wrap className="grid grid-cols-[.8fr_1.2fr] gap-14 max-[960px]:grid-cols-1">
            <Reveal><T k="faqEyebrow" className={eyebrow} /><T k="faqTitle" as="h2" className="text-[clamp(44px,5.6vw,72px)]" /></Reveal>
            <Faq ids={[1, 2, 3]} accent="text-chilitext" />
          </Wrap>
        </section>

        <section className="py-32 max-sm:py-20">
          <Wrap>
            <Reveal className="relative flex items-center justify-between gap-8 overflow-hidden rounded-[36px] bg-chili px-14 py-20 text-white max-[960px]:flex-col max-[960px]:items-start max-sm:px-7 max-sm:py-14">
              <Bread size={320} weight="fill" className="pointer-events-none absolute -right-16 -bottom-24 rotate-[-18deg] text-white/10" aria-hidden="true" />
              <div className="relative"><T k="ctaTitle" as="h2" className="mb-3 text-[clamp(48px,6.4vw,88px)]" /><T k="ctaLead" as="p" className="text-lg text-white/85" /></div>
              <a href={TEL} className={cn(btn, "relative flex-none bg-white px-8 py-4 text-lg text-[#c22f24]")}><Phone size={20} weight="bold" />{PHONE}</a>
            </Reveal>
          </Wrap>
        </section>
      </main>

      <footer className="pb-28 text-sm text-soft">
        <Wrap><div className="flex flex-wrap justify-between gap-3.5 border-t border-line pt-6"><span>© {new Date().getFullYear()} Saigon Deli · 3341 W Walnut St #102, Garland, TX 75042</span><a href={TEL}>{PHONE}</a></div></Wrap>
      </footer>
      <div className="glass fixed inset-x-3 bottom-3 z-30 hidden gap-2 rounded-full p-1.5 shadow-[inset_0_0_0_1px_var(--line)] max-sm:flex">
        <a href={TEL} className={cn(primary, "flex-1 py-3")}><T k="barCall" /></a>
        <a href={DIR} target="_blank" rel="noopener" className={cn(ghost, "flex-1 py-3")}><T k="barDir" /></a>
      </div>
      <span hidden>{LANGS.join()}</span>
    </>
  );
}
