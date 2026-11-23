import Link from "next/link";
import styles from "./page.module.css";
import ZoomOnView from "@/components/ZoomOnView";
import { BUSINESS } from "@/lib/business";
import { getSiteContent } from "@/lib/content";

// Shea edits texts and photos in Admin → Website; refresh at most every 30 seconds
export const revalidate = 30;

export default async function HomePage() {
  const c = await getSiteContent();
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
                Book an Appointment
              </Link>
              <Link href="/services" className="btn btn-outline">
                View Services
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
              { label: BUSINESS.hours.days, sub: "Open for appointments" },
              { label: BUSINESS.hours.time, sub: "Working hours" },
              { label: BUSINESS.phone.display, sub: "Call or WhatsApp" },
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
            <p className={styles.sectionLabel}>The Studio</p>
            <h2 className={styles.sectionTitle}>
              {c.about_title_1}
              <br />
              {c.about_title_2}
            </h2>
            <div className="divider divider--left" style={{ margin: "24px 0" }} />
            <p className={styles.aboutPara}>{c.about_para_1}</p>
            <p className={styles.aboutPara}>{c.about_para_2}</p>
            <Link href="/services" className="btn btn-outline" style={{ marginTop: "32px" }}>
              Explore All Services
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
              <p className={styles.sectionLabel}>Signature Treatments</p>
              <h2 className={styles.sectionTitle}>Our specialties</h2>
            </div>
            <Link href="/services" className="btn btn-ghost btn-sm">
              View all →
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
                    Book Now
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
            <p className={styles.sectionLabel}>Straight From The Studio</p>
            <h2 className={styles.sectionTitle}>The results speak</h2>
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
              See more on Instagram →
            </a>
          </div>
        </div>
      </section>

      {/* ── Testimonials (only real reviews, set in Admin → Website) ── */}
      {reviews.length > 0 && (
      <section className={`section-sm ${styles.testimonials}`}>
        <div className="container">
          <p className={styles.sectionLabel} style={{ textAlign: "center" }}>
            Client Stories
          </p>
          <h2 className={`${styles.sectionTitle} ${styles.testimonialsTitle}`}>
            Trusted by our regulars
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
              Book Now
            </Link>
          </div>
        </div>
      </section>

      {/* ── Contact info ──────────────────────────────────────── */}
      <section className={`section-sm ${styles.contact}`}>
        <div className="container">
          <div className={styles.policyBox}>
            <p className={styles.contactTitle}>Good to know</p>
            <ul className={styles.policyList}>
              {BUSINESS.policies.map((p) => <li key={p}>{p}</li>)}
              <li>Payment: {BUSINESS.payment.methods}.</li>
            </ul>
          </div>
          <p className={styles.sectionLabel} style={{ textAlign: "center", marginBottom: "40px" }}>
            Find Us
          </p>
          <div className={styles.contactGrid}>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>📍</span>
              <div>
                <p className={styles.contactTitle}>Location</p>
                <a href={BUSINESS.address.mapsUrl} target="_blank" rel="noopener noreferrer" className={styles.contactText}>
                  {BUSINESS.address.line1}<br />{BUSINESS.address.line2}<br />{BUSINESS.address.city}
                </a>
                <p className={styles.contactText} style={{ fontStyle: "italic", marginTop: "6px" }}>
                  {BUSINESS.homeServiceNote}
                </p>
              </div>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>📞</span>
              <div>
                <p className={styles.contactTitle}>Phone / WhatsApp</p>
                <a href={`tel:${BUSINESS.phone.tel}`} className={styles.contactLink}>{BUSINESS.phone.display}</a>
              </div>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>📷</span>
              <div>
                <p className={styles.contactTitle}>Socials</p>
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
