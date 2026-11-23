"use client";
import { createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { LANG_COOKIE, t as translate, type Lang, type TKey } from "@/lib/i18n";

const LangContext = createContext<Lang>("nl");

export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

/** Current language plus a translate function for client components. */
export function useLang() {
  const lang = useContext(LangContext);
  const router = useRouter();
  const setLang = (next: Lang) => {
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  };
  const t = (key: TKey) => translate(lang, key);
  return { lang, setLang, t };
}
