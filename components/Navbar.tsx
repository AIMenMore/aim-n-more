"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";
import { useLang } from "@/components/LangProvider";
import { LANGS, LANG_LABELS } from "@/lib/i18n";


export default function Navbar() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLang();
  const NAV_LINKS = [
    { href: "/", label: t("nav_home") },
    { href: "/services", label: t("nav_services") },
    { href: "/book", label: t("nav_book") },
  ];
  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) return null;

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo} aria-label="Aim & More Home">
          <img src="/images/logo.png" alt="Aim &amp; More" className={styles.logoImg} />
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.navLink} ${pathname === href ? styles.active : ""
                }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className={styles.right}>
          <div className={styles.langSwitch} role="group" aria-label={t("lang_label")}>
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`${styles.langBtn} ${l === lang ? styles.langActive : ""}`}
                aria-pressed={l === lang}
              >
                {LANG_LABELS[l]}
              </button>
            ))}
          </div>
          <Link href="/book" className="btn btn-primary btn-sm">
            {t("nav_book")}
          </Link>
        </div>
      </div>
    </header>
  );
}