"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleForgot = async () => {
    setError("");
    setInfo("");
    if (!email) {
      setError("Fill in your email first, then click “Forgot password?” again.");
      return;
    }
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (resetError) setError("Could not send the email. Please try again in a minute.");
    else setInfo("Check your email for a link to choose a new password.");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError("Invalid credentials. Please try again.");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoText}>AIM N MORE</span>
          <span className={styles.logoSub}>Admin Portal</span>
        </div>

        <form onSubmit={handleLogin} className={styles.form} noValidate>
          {error && <p className={styles.error}>{error}</p>}
          {info && <p style={{ textAlign: "center", fontSize: "14px" }}>{info}</p>}

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            id="login-submit"
            type="submit"
            className="btn btn-primary"
            disabled={loading || !email || !password}
            style={{ width: "100%", marginTop: "8px" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <button
            type="button"
            onClick={handleForgot}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", textDecoration: "underline", color: "inherit", opacity: 0.8 }}
          >
            Forgot password?
          </button>
        </form>

        <Link href="/" className={styles.backLink}>
          ← Back to website
        </Link>
      </div>
    </div>
  );
}
