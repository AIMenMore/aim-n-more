"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import styles from "../login/page.module.css";

// Shea lands here from the invite email or a "forgot password" email.
// Supabase signs her in from the link; she then chooses a new password.
export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [linkError, setLinkError] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Error from Supabase in the link (expired / already used)
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const desc = hash.get("error_description");
    if (desc) {
      setLinkError(desc.replace(/\+/g, " "));
      return;
    }
    const { data: sub } = supabase.auth.onAuthStateChange((_event: string, session: unknown) => {
      if (session) setReady(true);
    });
    supabase.auth.getSession().then(({ data }: { data: { session: unknown } }) => {
      if (data.session) setReady(true);
    });
    const t = setTimeout(() => {
      setLinkError((prev) => prev || "This link is not valid anymore. Ask for a new one below.");
    }, 6000);
    return () => {
      clearTimeout(t);
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (ready) setLinkError("");
  }, [ready]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("The two passwords are not the same.");
      return;
    }
    setLoading(true);
    setError("");
    const { error: updError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updError) {
      setError(updError.message || "Could not save the password. Please try again.");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoText}>AIM N MORE</span>
          <span className={styles.logoSub}>Choose your password</span>
        </div>

        {!ready ? (
          <div className={styles.form}>
            {linkError ? (
              <>
                <p className={styles.error}>{linkError}</p>
                <Link href="/login" className="btn btn-primary" style={{ width: "100%", textAlign: "center" }}>
                  Go to login → “Forgot password?”
                </Link>
              </>
            ) : (
              <p style={{ textAlign: "center" }}>Checking your link…</p>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            {error && <p className={styles.error}>{error}</p>}
            <div className="field">
              <label htmlFor="new-password">New password</label>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="confirm-password">Repeat password</label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !password || !confirm}
              style={{ width: "100%", marginTop: "8px" }}
            >
              {loading ? "Saving..." : "Save password"}
            </button>
          </form>
        )}

        <Link href="/" className={styles.backLink}>
          ← Back to website
        </Link>
      </div>
    </div>
  );
}
