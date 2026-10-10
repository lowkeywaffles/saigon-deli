"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { Plus } from "@phosphor-icons/react";
import { Reveal, fmtH, useClock, type Hours } from "@/components/kit";
import { T, useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const DAYS: Record<string, string[]> = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  es: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
  vi: ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"],
};
const TX: Record<string, { closed: string; open: (t: string) => string; opens: (t: string) => string; shut: string }> = {
  en: { closed: "Closed", open: t => "Open now · until " + t, opens: t => "Opens today at " + t, shut: "Closed now" },
  es: { closed: "Cerrado", open: t => "Abierto ahora · hasta las " + t, opens: t => "Abre hoy a las " + t, shut: "Cerrado ahora" },
  vi: { closed: "Đóng cửa", open: t => "Đang mở · đến " + t, opens: t => "Mở hôm nay lúc " + t, shut: "Đang đóng cửa" },
};

/** Live "open now" pill text in Dallas time. */
export function useStatus(hours: Hours) {
  const { lang } = useLang();
  const c = useClock(hours);
  const X = TX[lang] ?? TX.en;
  if (!c) return { text: "", open: false, today: -1 };
  const h = hours[c.today];
  return { today: c.today, open: c.open, text: c.open && h ? X.open(fmtH(h[1])) : c.opensLater && h ? X.opens(fmtH(h[0])) : X.shut };
}

/** Weekly hours, Monday first, today highlighted. */
export function HoursTable({ hours, accent = "text-ink" }: { hours: Hours; accent?: string }) {
  const { lang } = useLang();
  const { today } = useStatus(hours);
  const D = DAYS[lang] ?? DAYS.en, X = TX[lang] ?? TX.en;
  return (
    <table className="w-full text-[15px]"><tbody>
      {[1, 2, 3, 4, 5, 6, 0].map(d => { const h = hours[d]; return (
        <tr key={d} className={cn("border-b border-line", today === d && accent)}>
          <td className="py-2.5">{D[d]}{today === d && " •"}</td>
          <td className="py-2.5 text-end font-semibold tabular-nums">{h ? `${fmtH(h[0])} - ${fmtH(h[1])}` : X.closed}</td>
        </tr>); })}
    </tbody></table>
  );
}

/** Accordion FAQ from translation keys q{n} / a{n}. */
export function Faq({ ids, accent = "text-ink", item = "rounded-2xl bg-card shadow-[inset_0_0_0_1px_var(--line)]" }: { ids: (string | number)[]; accent?: string; item?: string }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="grid gap-3">
      {ids.map((n, i) => (
        <Reveal key={n} delay={i * 0.04} className={item}>
          <button type="button" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-start text-[17px] font-semibold">
            <T k={`q${n}`} />
            <Plus size={20} weight="bold" className={cn("flex-none transition-transform duration-500 ease-spring", accent)} style={{ transform: open === i ? "rotate(45deg)" : "none" }} />
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }} className="overflow-hidden">
                <T k={`a${n}`} as="p" className="px-6 pb-5 text-soft" />
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      ))}
    </div>
  );
}

/** Google map in the page's language, dimmed for dark mode. */
export function MapFrame({ q, title = "Map", className }: { q: string; title?: string; className?: string }) {
  const { lang } = useLang();
  return <iframe title={title} loading="lazy" className={cn("size-full border-0 [filter:var(--map)]", className)} src={`https://maps.google.com/maps?q=${q}&z=15&output=embed&hl=${lang}`} />;
}

/** Theme state once mounted (avoids a flash of the wrong switch position). */
export function useDark() {
  const { resolvedTheme, setTheme } = useTheme();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return { dark: ready && resolvedTheme === "dark", setTheme };
}
