"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Scroll reveal: a slow fade-up out of soft focus. Visible in the HTML; only animates once JS is running. */
export function Reveal({ children, delay = 0, className, as: Tag = "div" }: { children: React.ReactNode; delay?: number; className?: string; as?: React.ElementType }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("rv");
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } }, { rootMargin: "0px 0px -60px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <Tag ref={ref} className={className} style={{ transitionDelay: `${delay}s` }}>{children}</Tag>;
}

export const Wrap = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn("mx-auto w-full max-w-[1200px] px-7 max-sm:px-4", className)}>{children}</div>
);

/** Weekly hours in Dallas time: which day it is, and whether the shop is open right now. */
export type Hours = Record<number, [number, number] | null>;
export const fmtH = (h: number) => { const hr = Math.floor(h), m = Math.round((h - hr) * 60); return `${hr % 12 || 12}:${String(m).padStart(2, "0")} ${hr < 12 || hr === 24 ? "AM" : "PM"}`; };
export function useClock(hours: Hours) {
  const [s, set] = useState<{ today: number; open: boolean; opensLater: boolean } | null>(null);
  useEffect(() => {
    const tick = () => {
      const d = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }));
      const h = d.getHours() + d.getMinutes() / 60, r = hours[d.getDay()];
      set({ today: d.getDay(), open: !!r && h >= r[0] && h < r[1], opensLater: !!r && h < r[0] });
    };
    tick(); const t = setInterval(tick, 60000); return () => clearInterval(t);
  }, [hours]);
  return s;
}

/** View-transition theme flip that grows a circle from the button that was pressed. */
export function flipTheme(btn: HTMLElement, apply: () => void) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
  if (!doc.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return apply();
  const r = btn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
  const root = document.documentElement.style;
  root.setProperty("--rx", x + "px"); root.setProperty("--ry", y + "px");
  root.setProperty("--rr", Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + "px");
  doc.startViewTransition(apply);
}
