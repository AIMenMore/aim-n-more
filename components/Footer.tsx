import Link from "next/link";
import styles from "./Footer.module.css";
import { BUSINESS } from "@/lib/business";
import { getLang } from "@/lib/lang-server";
import { t } from "@/lib/i18n";

export default async function Footer() {
  const lang = await getLang();
  return (
    <footer className={styles.footer}>
      <span className="gold-line" />
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <span className={styles.logo}>AIM &amp; MORE</span>
          <p className={styles.tagline}>
            {t(lang, "footer_tagline")}
          </p>
        </div>

        <div className={styles.columns}>
          <div className={styles.col}>
            <p className={styles.colTitle}>{t(lang, "footer_hours")}</p>
            <p>{t(lang, "hours_days")}</p>
            <p>{BUSINESS.hours.time}</p>
            <p style={{ color: "var(--cream-muted)", fontSize: "13px", marginTop: "4px" }}>
              {t(lang, "hours_closed")}
            </p>
          </div>

          <div className={styles.col}>
            <p className={styles.colTitle}>{t(lang, "footer_contact")}</p>
            <a href={`tel:${BUSINESS.phone.tel}`} className={styles.colLink}>
              {BUSINESS.phone.display}
            </a>
            <a href={BUSINESS.phone.whatsapp} className={styles.colLink} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            <a href={`mailto:${BUSINESS.email}`} className={styles.colLink}>
              {t(lang, "footer_email")}
            </a>
          </div>

          <div className={styles.col}>
            <p className={styles.colTitle}>{t(lang, "footer_follow")}</p>
            <a
              href={BUSINESS.socials.instagram.url}
              className={styles.colLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram {BUSINESS.socials.instagram.label}
            </a>
            <a
              href={BUSINESS.socials.tiktok.url}
              className={styles.colLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              TikTok {BUSINESS.socials.tiktok.label}
            </a>
            <a
              href={BUSINESS.socials.facebook.url}
              className={styles.colLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook — {BUSINESS.socials.facebook.label}
            </a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} Aim &amp; More. {t(lang, "footer_rights")}</p>
        <a
          href="https://wa.me/5978902214"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.madeBy}
        >
          Made by GVG · +597 890 2214
        </a>
        <Link href="/login" className={styles.adminLink}>
          Admin
        </Link>
      </div>
    </footer>
  );
}
