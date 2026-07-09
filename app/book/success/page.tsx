import Link from "next/link";
import styles from "./page.module.css";

export default function SuccessPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.card}>
          <div className={styles.icon} aria-hidden="true">✦</div>
          <h1 className={styles.title}>You&apos;re booked!</h1>
          <p className={styles.sub}>
            Your appointment request has been received. Shea will confirm it
            shortly — keep an eye on your WhatsApp or phone.
          </p>
          <p className={styles.note}>
            Payment is by cash or bank wire upon arrival.
          </p>
          <div className={styles.actions}>
            <Link href="/" className="btn btn-primary">
              Back to Home
            </Link>
            <Link href="/services" className="btn btn-outline">
              View All Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
