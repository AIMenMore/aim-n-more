import { supabase, type Service } from "@/lib/supabase";
import Link from "next/link";
import styles from "./page.module.css";

const CATEGORY_ORDER = ["Facials", "Mani / Pedi", "Waxing", "PMU"];

export const revalidate = 60; // revalidate every 60s

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
  const grouped = await getServices();
  const categories = CATEGORY_ORDER.filter((c) => grouped[c]);

  return (
    <div className={styles.page}>
      {/* Header */}
      <section className={styles.header}>
        <div className="container">
          <p className={styles.eyebrow}>What we offer</p>
          <h1 className={styles.title}>Our Services</h1>
          <div className="divider" style={{ marginTop: "20px" }} />
          <p className={styles.sub}>
            All prices in Surinamese dollars (SRD). Book online or call{" "}
            <a href="tel:+5977173636" className={styles.phone}>
              +597 717 3636
            </a>
            .
          </p>
        </div>
      </section>

      {/* Services */}
      <section className={`section ${styles.content}`}>
        <div className="container">
          {categories.length === 0 ? (
            <p className={styles.empty}>No services available at this time.</p>
          ) : (
            categories.map((category) => (
              <div key={category} className={styles.category}>
                <div className={styles.categoryHeader}>
                  <h2 className={styles.categoryTitle}>{category}</h2>
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
                          Book Now
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
          <p className={styles.ctaText}>Ready to treat yourself?</p>
          <Link href="/book" className="btn btn-primary" style={{ marginTop: "20px" }}>
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
