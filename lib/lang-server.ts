import { cookies, headers } from "next/headers";
import { isLang, langFromAcceptLanguage, LANG_COOKIE, type Lang } from "@/lib/i18n";

/** The visitor's language: their own choice (cookie) or else their browser language. */
export async function getLang(): Promise<Lang> {
  const c = (await cookies()).get(LANG_COOKIE)?.value;
  if (isLang(c)) return c;
  return langFromAcceptLanguage((await headers()).get("accept-language"));
}
