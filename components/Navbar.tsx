"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/book", label: "Book Now" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) return null;

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo} aria-label="Aim N More Home">
          <span className={styles.logoMono}>AIM</span>
          <span className={styles.logoDot}>·</span>
          <span className={styles.logoSub}>N MORE</span>
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.navLink} ${pathname === href ? styles.active : ""
                }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <Link href="/book" className="btn btn-primary btn-sm">
          Book Now
        </Link>
      </div>
    </header>
  );
}