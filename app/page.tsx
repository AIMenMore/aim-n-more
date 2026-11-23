import Link from "next/link";
import styles from "./page.module.css";
import ZoomOnView from "@/components/ZoomOnView";
import { BUSINESS } from "@/lib/business";

const FEATURED_SERVICES = [
  { name: "Ombre Powder Brows", category: "PMU", price: 2500, tag: "Incl. touch-up", image_url: "https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?w=400&q=80" },
  { name: "Russian Pedicure", category: "Mani / Pedi", price: 550, tag: null, image_url: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&q=80" },
  { name: "Brazilian Wax", category: "Waxing", price: 550, tag: null, image_url: null },
  { name: "Dermaplaning", category: "Facials", price: 975, tag: null, image_url: "https://images.unsplash.com/photo-1570172619644-def2d4e680a6?w=400&q=80" },
];

const GALLERY = [
  { src: "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=500&q=80", alt: "Ombre powder brow result close-up" },
  { src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=80", alt: "Fresh manicure detail" },
  { src: "https://images.unsplash.com/photo-1588514727390-91fd5ebaef81?w=500&q=80", alt: "Lipblush PMU result" },
  { src: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c1?w=500&q=80", alt: "Pedicure finishing touch" },
  { src: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80", alt: "Brow shaping in progress" },
  { src: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=80", alt: "Studio treatment moment" },
];

const TESTIMONIALS = [
  { quote: "My brows have never looked this precise. Shea took her time and it shows — three years later and people still ask where I get them done.", name: "Naomi R.", service: "Ombre Powder Brows" },
  { quote: "I walked in nervous about the Brazilian and walked out telling every friend I have. Clean space, no rushing, exactly on time.", name: "Denise K.", service: "Waxing" },
  { quote: "Booked online in a minute, got a reminder, showed up — no back and forth on WhatsApp needed. The pedicure itself was excellent too.", name: "Priscilla A.", service: "Russian Pedicure" },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroContent}>
            <p className={styles.heroEyebrow}>Aim N More Studio · Suriname</p>
            <h1 className={styles.heroTitle}>
              Because you deserve
              <br />
              <em>good brows &amp; sexy lips,</em>
              <br />
              every day.
            </h1>
            <p className={styles.heroSub}>
              Premium nails · pedicures · waxing · permanent make-up
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
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80"
                alt="Ombre powder brows treatment at Aim N More"
                className={styles.heroImg}
              />
            </div>
            <div className={styles.heroImageRing} aria-hidden="true" />
            <div className={styles.heroImageBadge}>
              <span className={styles.heroImageBadgeNum}>500+</span>
              <span className={styles.heroImageBadgeLabel}>Happy clients</span>
            </div>
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
              Where confidence
              <br />
              is crafted.
            </h2>
            <div className="divider divider--left" style={{ margin: "24px 0" }} />
            <p className={styles.aboutPara}>
              Aim N More is a boutique beauty studio in Suriname offering a curated
              menu of nail care, waxing, facials, and permanent make-up. Every
              treatment is performed with precision, care, and an eye for detail —
              because you deserve to feel extraordinary.
            </p>
            <p className={styles.aboutPara}>
              Our signature Ombre Powder Brows and Lipblush PMU treatments are
              fully inclusive of the follow-up touch-up, ensuring your results
              last beautifully.
            </p>
            <Link href="/services" className="btn btn-outline" style={{ marginTop: "32px" }}>
              Explore All Services
            </Link>
          </div>
          <div className={styles.aboutImageWrap}>
            <div className={styles.aboutImage}>
              <img
                src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=700&q=80"
                alt="Inside the Aim N More studio"
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
            {FEATURED_SERVICES.map((s, idx) => (
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
            {GALLERY.map((g) => (
              <ZoomOnView key={g.src} className={styles.galleryCard}>
                <img src={g.src} alt={g.alt} className={styles.galleryImg} />
              </ZoomOnView>
            ))}
          </div>

          <div className={styles.galleryFooter}>
            <a
              href="https://instagram.com/aimnmore"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm"
            >
              See more on Instagram →
            </a>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────── */}
      <section className={`section-sm ${styles.testimonials}`}>
        <div className="container">
          <p className={styles.sectionLabel} style={{ textAlign: "center" }}>
            Client Stories
          </p>
          <h2 className={`${styles.sectionTitle} ${styles.testimonialsTitle}`}>
            Trusted by our regulars
          </h2>

          <div className={styles.testimonialsGrid}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className={styles.testimonialCard}>
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

      {/* ── CTA banner ────────────────────────────────────────── */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>Ready to glow?</h2>
            <p className={styles.ctaSub}>
              Book your appointment online — it only takes a minute.
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
