import Link from "next/link";
import styles from "./Footer.module.css";
import { BUSINESS } from "@/lib/business";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className="gold-line" />
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <span className={styles.logo}>AIM N MORE</span>
          <p className={styles.tagline}>
            Because you deserve good brows and sexy lips, every day.
          </p>
        </div>

        <div className={styles.columns}>
          <div className={styles.col}>
            <p className={styles.colTitle}>Hours</p>
            <p>{BUSINESS.hours.days}</p>
            <p>{BUSINESS.hours.time}</p>
            <p style={{ color: "var(--cream-muted)", fontSize: "13px", marginTop: "4px" }}>
              {BUSINESS.hours.closed}
            </p>
          </div>

          <div className={styles.col}>
            <p className={styles.colTitle}>Contact</p>
            <a href={`tel:${BUSINESS.phone.tel}`} className={styles.colLink}>
              {BUSINESS.phone.display}
            </a>
            <a href={BUSINESS.phone.whatsapp} className={styles.colLink} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            <a href={`mailto:${BUSINESS.email}`} className={styles.colLink}>
              Email us
            </a>
          </div>

          <div className={styles.col}>
            <p className={styles.colTitle}>Follow</p>
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
        <p>© {new Date().getFullYear()} Aim N More. All rights reserved.</p>
        <Link href="/login" className={styles.adminLink}>
          Admin
        </Link>
      </div>
    </footer>
  );
}
