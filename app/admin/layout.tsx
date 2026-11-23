"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import styles from "./layout.module.css";

const NAV = [
  { href: "/admin", label: "Bookings", icon: "📋" },
  { href: "/admin/services", label: "Services", icon: "✂️" },
  { href: "/admin/availability", label: "Availability", icon: "🗓️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      if (!session) {
        router.replace("/login");
      } else {
        setChecking(false);
      }
    });
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (checking) {
    return (
      <div className={styles.loading}>
        <span className={styles.loadingText}>Loading…</span>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <span className={styles.logoText}>AIM &amp; MORE</span>
          <span className={styles.logoBadge}>Admin</span>
        </div>

        <nav className={styles.nav}>
          {NAV.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.navLink} ${pathname === href ? styles.navActive : ""}`}
              id={`admin-nav-${label.toLowerCase()}`}
            >
              <span className={styles.navIcon}>{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <Link href="/" className={styles.viewSite} target="_blank">
            ↗ View site
          </Link>
          <button id="sign-out" onClick={handleSignOut} className={styles.signOut}>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={styles.main}>{children}</main>
    </div>
  );
}
