"use client";

import { createContext, useContext, useEffect, useState } from "react";
import strings from "@/content/strings.json";

type Dict = Record<string, string>;
const S = strings as unknown as Record<string, Dict>;
export const LANGS = Object.keys(S);

const LangCtx = createContext<{ lang: string; setLang: (l: string) => void }>({ lang: "en", setLang: () => {} });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState("en");

  // start: ?lang= link, then saved choice, then the browser language
  useEffect(() => {
    let init = new URLSearchParams(location.search).get("lang");
    if (!init || !LANGS.includes(init)) { try { init = localStorage.getItem("lang"); } catch { init = null; } }
    if (!init || !LANGS.includes(init)) init = LANGS.find(l => navigator.language.toLowerCase().startsWith(l)) ?? "en";
    setLangState(init);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    const d = S[lang];
    if (d.title) document.title = d.title.replace(/&amp;/g, "&");
    document.querySelector('meta[name="description"]')?.setAttribute("content", d.desc ?? S.en.desc);
  }, [lang]);

  const setLang = (l: string) => { setLangState(l); try { localStorage.setItem("lang", l); } catch {} };
  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);

/** Translator falling back to English. */
export function useT() {
  const { lang } = useLang();
  return (k: string) => S[lang]?.[k] ?? S.en[k] ?? "";
}

/** A translated string that may carry inline markup (spans, <br>, <bdi>). The content is our own. */
export function T({ k, as: Tag = "span", className }: { k: string; as?: React.ElementType; className?: string }) {
  const t = useT();
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: t(k) }} />;
}

