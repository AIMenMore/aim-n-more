import { supabase, type Service } from "@/lib/supabase";
import Link from "next/link";
import styles from "./page.module.css";
import { BUSINESS } from "@/lib/business";
import { getLang } from "@/lib/lang-server";
import { t, categoryName } from "@/lib/i18n";

const CATEGORY_ORDER = ["Facials", "Mani / Pedi", "Waxing", "PMU"];

// Rendered per visit (language comes from the visitor's choice)

async function getServices(): Promise<Record<string, Service[]>> {
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("active", true)
    .order("price", { ascending: true });

  const grouped: Record<string, Service[]> = {};
  (data ?? []).forEach((s: Service) => {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push(s);
  });
  return grouped;
}

export default async function ServicesPage() {
  const lang = await getLang();
  const grouped = await getServices();
  const categories = CATEGORY_ORDER.filter((c) => grouped[c]);

  return (
    <div className={styles.page}>
      {/* Header */}
      <section className={styles.header}>
        <div className="container">
          <p className={styles.eyebrow}>{t(lang, "services_eyebrow")}</p>
          <h1 className={styles.title}>{t(lang, "services_title")}</h1>
          <div className="divider" style={{ marginTop: "20px" }} />
          <p className={styles.sub}>
            {t(lang, "services_prices")}{" "}
            <a href={`tel:${BUSINESS.phone.tel}`} className={styles.phone}>
              {BUSINESS.phone.display}
            </a>
            .
          </p>
        </div>
      </section>

      {/* Services */}
      <section className={`section ${styles.content}`}>
        <div className="container">
          {categories.length === 0 ? (
            <p className={styles.empty}>{t(lang, "services_empty")}</p>
          ) : (
            categories.map((category) => (
              <div key={category} className={styles.category}>
                <div className={styles.categoryHeader}>
                  <h2 className={styles.categoryTitle}>{categoryName(lang, category)}</h2>
                  <span className="gold-line" style={{ flex: 1, marginLeft: "24px" }} />
                </div>
                <div className={styles.magazineGrid}>
                  {grouped[category].map((service) => (
                    <div key={service.id} className={styles.magazineCard}>
                      <div className={styles.magazineImageWrap}>
                        <div className={styles.magazineImageInner}>
                          {service.image_url ? (
                            <img src={service.image_url} alt={service.name} className={styles.magazineImg} />
                          ) : (
                            <div className={styles.magazineImagePlaceholder}></div>
                          )}
                        </div>
                        <div className={styles.magazinePriceBadge}>
                          {service.deal_price ? (
                            <>
                              <span className={styles.originalPrice}>
                                SRD {service.price.toLocaleString()}
                              </span>
                              <span style={{ marginLeft: "6px" }}>
                                SRD {service.deal_price.toLocaleString()}
                              </span>
                            </>
                          ) : (
                            <span>SRD {service.price.toLocaleString()}</span>
                          )}
                        </div>
                      </div>

                      <div className={styles.magazineContent}>
                        <h3 className={styles.magazineTitle}>{service.name}</h3>
                        <span className={styles.duration}>
                          ~{service.duration_minutes} min
                        </span>
                        
                        <Link
                          href={`/book?service=${service.id}`}
                          className={`btn btn-primary ${styles.magazineBookBtn}`}
                          id={`book-${service.id}`}
                        >
                          {t(lang, "book_now")}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* CTA */}
      <div className={styles.cta}>
        <div className="container" style={{ textAlign: "center" }}>
          <p className={styles.ctaText}>{t(lang, "services_cta")}</p>
          <Link href="/book" className="btn btn-primary" style={{ marginTop: "20px" }}>
            {t(lang, "book_now")}
          </Link>
        </div>
      </div>
    </div>
  );
}
