import Link from "next/link";
import { BUSINESS } from "@/lib/business";
import { getLang } from "@/lib/lang-server";
import { t } from "@/lib/i18n";
import styles from "./page.module.css";

export default async function SuccessPage() {
  const lang = await getLang();
  const { payment } = BUSINESS;
  const policies = [t(lang, "policy_late"), t(lang, "policy_cancelled"), t(lang, "policy_notice")];
  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.card}>
          <div className={styles.icon} aria-hidden="true">✦</div>
          <h1 className={styles.title}>{t(lang, "booked_title")}</h1>
          <p className={styles.sub}>{t(lang, "booked_sub")}</p>
          <div className={styles.note} style={{ textAlign: "left" }}>
            <strong>{t(lang, "payment")}:</strong> {t(lang, "payment_methods")}.<br />
            {t(lang, "bank_transfer")}: {payment.bank}, {t(lang, "account")} {payment.account}<br />
            {t(lang, "account_name")}: {payment.accountName}<br />
            {t(lang, "description")}: {t(lang, "payment_reference")}
          </div>
          <div className={styles.note} style={{ textAlign: "left" }}>
            {policies.map((p) => (
              <span key={p}>{p}<br /></span>
            ))}
            {t(lang, "need_change")}{" "}
            <a href={BUSINESS.phone.whatsapp} target="_blank" rel="noopener noreferrer">
              {BUSINESS.phone.display}
            </a>.
          </div>
          <div className={styles.actions}>
            <Link href="/" className="btn btn-primary">
              {t(lang, "back_home")}
            </Link>
            <Link href="/services" className="btn btn-outline">
              {t(lang, "view_all_services")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
