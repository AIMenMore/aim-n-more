import Link from "next/link";
import styles from "./Footer.module.css";

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
            <p>Tue – Sat</p>
            <p>10:00 – 19:00</p>
            <p style={{ color: "var(--cream-muted)", fontSize: "13px", marginTop: "4px" }}>
              Sun & Mon closed
            </p>
          </div>

          <div className={styles.col}>
            <p className={styles.colTitle}>Contact</p>
            <a href="tel:+5977173636" className={styles.colLink}>
              +597 717 3636
            </a>
            <a href="https://wa.me/5977173636" className={styles.colLink} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            <a href="mailto:yourstruly.luxx@gmail.com" className={styles.colLink}>
              Email us
            </a>
          </div>

          <div className={styles.col}>
            <p className={styles.colTitle}>Follow</p>
            <a
              href="https://instagram.com/aimnmore"
              className={styles.colLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram @aimnmore
            </a>
            <a
              href="https://facebook.com"
              className={styles.colLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook — AIM &amp;more
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
