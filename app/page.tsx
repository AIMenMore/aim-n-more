import Link from "next/link";
import styles from "./page.module.css";
import ZoomOnView from "@/components/ZoomOnView";
import { BUSINESS } from "@/lib/business";
import { getSiteContent } from "@/lib/content";
import { getLang } from "@/lib/lang-server";
import { t } from "@/lib/i18n";

// Shea edits texts and photos in Admin → Website; refresh at most every 30 seconds
// Rendered per visit (language comes from the visitor's choice)

export default async function HomePage() {
  const lang = await getLang();
  const c = await getSiteContent(lang);
  const policies = [t(lang, "policy_late"), t(lang, "policy_cancelled"), t(lang, "policy_notice")];
  const featured = [1, 2, 3, 4]
    .map((n) => ({
      name: c[`feat${n}_name`],
      category: c[`feat${n}_category`],
      price: c[`feat${n}_price`],
      tag: c[`feat${n}_tag`],
      image_url: c[`feat${n}_image`],
    }))
    .filter((f) => f.name);
  const gallery = [1, 2, 3, 4, 5, 6, 7]
    .map((n) => c[`gallery_${n}`])
    .filter(Boolean);
  const reviews = [1, 2, 3]
    .map((n) => ({ quote: c[`review${n}_quote`], name: c[`review${n}_name`], service: c[`review${n}_service`] }))
    .filter((r) => r.quote);

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroContent}>
            <p className={styles.heroEyebrow}>{c.hero_eyebrow}</p>
            <h1 className={styles.heroTitle}>
              {c.hero_title_1}
              <br />
              <em>{c.hero_title_highlight}</em>
              <br />
              {c.hero_title_2}
            </h1>
            <p className={styles.heroSub}>
              {c.hero_sub}
            </p>
            <div className={styles.heroCta}>
              <Link href="/book" className="btn btn-primary">
                {t(lang, "home_book")}
              </Link>
              <Link href="/services" className="btn btn-outline">
                {t(lang, "home_view_services")}
              </Link>
            </div>
          </div>

          <div className={styles.heroImageWrap}>
            <div className={styles.heroImage}>
              <img
                src={c.hero_image}
                alt="Ombre powder brows treatment at Aim & More"
                className={styles.heroImg}
              />
            </div>
            <div className={styles.heroImageRing} aria-hidden="true" />
            {c.hero_badge_num && (
              <div className={styles.heroImageBadge}>
                <span className={styles.heroImageBadgeNum}>{c.hero_badge_num}</span>
                <span className={styles.heroImageBadgeLabel}>{c.hero_badge_label}</span>
              </div>
            )}
          </div>
        </div>
        <div className={styles.heroScroll} aria-hidden="true">
          <span />
        </div>
      </section>

      {/* ── Intro strip ───────────────────────────────────────── */}
      <section className={`section-sm ${styles.intro}`}>
        <div className="container">
          <div className={styles.introGrid}>
            {[
              { label: t(lang, "hours_days"), sub: t(lang, "intro_open") },
              { label: BUSINESS.hours.time, sub: t(lang, "intro_hours") },
              { label: BUSINESS.phone.display, sub: t(lang, "intro_call") },
            ].map((item) => (
              <div key={item.label} className={styles.introItem}>
                <span className={styles.introLabel}>{item.label}</span>
                <span className={styles.introSub}>{item.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ─────────────────────────────────────────────── */}
      <section className={`section ${styles.about}`}>
        <div className={`container ${styles.aboutInner}`}>
          <div className={styles.aboutText}>
            <p className={styles.sectionLabel}>{t(lang, "studio_label")}</p>
            <h2 className={styles.sectionTitle}>
              {c.about_title_1}
              <br />
              {c.about_title_2}
            </h2>
            <div className="divider divider--left" style={{ margin: "24px 0" }} />
            <p className={styles.aboutPara}>{c.about_para_1}</p>
            <p className={styles.aboutPara}>{c.about_para_2}</p>
            <Link href="/services" className="btn btn-outline" style={{ marginTop: "32px" }}>
              {t(lang, "explore_services")}
            </Link>
          </div>
          <div className={styles.aboutImageWrap}>
            <div className={styles.aboutImage}>
              <img
                src={c.about_image}
                alt="Shea in the Aim & More studio"
                className={styles.aboutImg}
              />
            </div>
            <div className={styles.aboutAccent} aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* ── Featured services ─────────────────────────────────── */}
      <section className={`section ${styles.featured}`}>
        <div className="container">
          <div className={styles.featuredHeader}>
            <div>
              <p className={styles.sectionLabel}>{t(lang, "featured_label")}</p>
              <h2 className={styles.sectionTitle}>{t(lang, "featured_title")}</h2>
            </div>
            <Link href="/services" className="btn btn-ghost btn-sm">
              {t(lang, "view_all")}
            </Link>
          </div>

          <div className={styles.magazineGrid}>
            {featured.map((s) => (
              <div key={s.name} className={styles.magazineCard}>
                {/* Image Placeholder with Gold Ring Motif */}
                <div className={styles.magazineImageWrap}>
                  <div className={styles.magazineImageInner}>
                    {s.image_url ? (
                      <img src={s.image_url} alt={s.name} className={styles.magazineImg} />
                    ) : (
                      <div className={styles.magazineImagePlaceholder}></div>
                    )}
                  </div>
                  {/* Floating Price Badge */}
                  <div className={styles.magazinePriceBadge}>
                    <span>SRD {s.price}</span>
                  </div>
                </div>
                
                <div className={styles.magazineContent}>
                  <p className={styles.magazineCategory}>{s.category}</p>
                  <h3 className={styles.magazineTitle}>{s.name}</h3>
                  {s.tag && <p className={styles.magazineTag}>{s.tag}</p>}
                  <Link href="/book" className={`btn btn-primary ${styles.magazineBookBtn}`}>
                    {t(lang, "book_now")}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery ───────────────────────────────────────────── */}
      <section className={`section ${styles.gallery}`}>
        <div className="container">
          <div className={styles.galleryHeader}>
            <p className={styles.sectionLabel}>{t(lang, "gallery_label")}</p>
            <h2 className={styles.sectionTitle}>{t(lang, "gallery_title")}</h2>
          </div>

          <div className={styles.galleryStrip}>
            {gallery.map((src, i) => (
              <ZoomOnView key={src + i} className={styles.galleryCard}>
                <img src={src} alt={`Result from the studio, photo ${i + 1}`} className={styles.galleryImg} />
              </ZoomOnView>
            ))}
          </div>

          <div className={styles.galleryFooter}>
            <a
              href={BUSINESS.socials.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm"
            >
              {t(lang, "gallery_more")}
            </a>
          </div>
        </div>
      </section>

      {/* ── Testimonials (only real reviews, set in Admin → Website) ── */}
      {reviews.length > 0 && (
      <section className={`section-sm ${styles.testimonials}`}>
        <div className="container">
          <p className={styles.sectionLabel} style={{ textAlign: "center" }}>
            {t(lang, "reviews_label")}
          </p>
          <h2 className={`${styles.sectionTitle} ${styles.testimonialsTitle}`}>
            {t(lang, "reviews_title")}
          </h2>

          <div className={styles.testimonialsGrid}>
            {reviews.map((t) => (
              <div key={t.quote} className={styles.testimonialCard}>
                <p className={styles.testimonialQuote}>&ldquo;{t.quote}&rdquo;</p>
                <div className={styles.testimonialFooter}>
                  <span className={styles.testimonialName}>{t.name}</span>
                  <span className={styles.testimonialService}>{t.service}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ── CTA banner ────────────────────────────────────────── */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>{c.cta_title}</h2>
            <p className={styles.ctaSub}>
              {c.cta_sub}
            </p>
            <Link href="/book" className="btn btn-primary">
              {t(lang, "book_now")}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Contact info ──────────────────────────────────────── */}
      <section className={`section-sm ${styles.contact}`}>
        <div className="container">
          <div className={styles.policyBox}>
            <p className={styles.contactTitle}>{t(lang, "good_to_know")}</p>
            <ul className={styles.policyList}>
              {policies.map((p) => <li key={p}>{p}</li>)}
              <li>{t(lang, "payment")}: {t(lang, "payment_methods")}.</li>
            </ul>
          </div>
          <p className={styles.sectionLabel} style={{ textAlign: "center", marginBottom: "40px" }}>
            {t(lang, "find_us")}
          </p>
          <div className={styles.contactGrid}>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>📍</span>
              <div>
                <p className={styles.contactTitle}>{t(lang, "location")}</p>
                <a href={BUSINESS.address.mapsUrl} target="_blank" rel="noopener noreferrer" className={styles.contactText}>
                  {BUSINESS.address.line1}<br />{t(lang, "address_line2")}<br />{BUSINESS.address.city}
                </a>
                <p className={styles.contactText} style={{ fontStyle: "italic", marginTop: "6px" }}>
                  {t(lang, "home_service_note")}
                </p>
              </div>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>📞</span>
              <div>
                <p className={styles.contactTitle}>{t(lang, "phone_whatsapp")}</p>
                <a href={`tel:${BUSINESS.phone.tel}`} className={styles.contactLink}>{BUSINESS.phone.display}</a>
              </div>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>📷</span>
              <div>
                <p className={styles.contactTitle}>{t(lang, "socials")}</p>
                <a href={BUSINESS.socials.instagram.url} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                  Instagram {BUSINESS.socials.instagram.label}
                </a><br />
                <a href={BUSINESS.socials.tiktok.url} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                  TikTok {BUSINESS.socials.tiktok.label}
                </a><br />
                <a href={BUSINESS.socials.facebook.url} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                  Facebook {BUSINESS.socials.facebook.label}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
