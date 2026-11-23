import Link from "next/link";
import { BUSINESS } from "@/lib/business";
import styles from "./page.module.css";

export default function SuccessPage() {
  const { payment } = BUSINESS;
  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.card}>
          <div className={styles.icon} aria-hidden="true">✦</div>
          <h1 className={styles.title}>You&apos;re booked!</h1>
          <p className={styles.sub}>
            Your appointment request has been received. {BUSINESS.owner} will confirm it
            shortly — keep an eye on your WhatsApp or phone.
          </p>
          <div className={styles.note} style={{ textAlign: "left" }}>
            <strong>Payment:</strong> {payment.methods}.<br />
            Bank transfer: {payment.bank}, account {payment.account}<br />
            Name: {payment.accountName}<br />
            Description: {payment.reference}
          </div>
          <div className={styles.note} style={{ textAlign: "left" }}>
            {BUSINESS.policies.map((p) => (
              <span key={p}>{p}<br /></span>
            ))}
            Need to change something? WhatsApp{" "}
            <a href={BUSINESS.phone.whatsapp} target="_blank" rel="noopener noreferrer">
              {BUSINESS.phone.display}
            </a>.
          </div>
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
