"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { compressImage } from "@/lib/image";
import { CONTENT_GROUPS, DEFAULT_CONTENT, TRANSLATED_TYPES, langKey, type SiteContent } from "@/lib/content";
import { LANGS, type Lang } from "@/lib/i18n";

const LANG_NAMES: Record<Lang, string> = { nl: "Nederlands", en: "English" };
import styles from "../services/page.module.css";

// Admin → Website: Shea changes the home page texts and photos here.
export default function ContentAdminPage() {
  const [values, setValues] = useState<SiteContent>({ ...DEFAULT_CONTENT });
  const [saved, setSaved] = useState<SiteContent>({ ...DEFAULT_CONTENT });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_content").select("key, value");
      const merged = { ...DEFAULT_CONTENT };
      (data ?? []).forEach((r: { key: string; value: string | null }) => {
        merged[r.key] = r.value ?? "";
      });
      setValues(merged);
      setSaved(merged);
      setLoading(false);
    })();
  }, []);

  const set = (key: string, value: string) => setValues((v) => ({ ...v, [key]: value }));

  const uploadImage = async (key: string, file: File) => {
    try {
      setUploadingKey(key);
      const blob = await compressImage(file, 1400, 1400, 0.82);
      const fileName = `site/${key}-${Date.now()}.jpg`;
      const { error } = await supabase.storage
        .from("service-images")
        .upload(fileName, blob, { contentType: "image/jpeg" });
      if (error) {
        showToast("Upload failed: " + error.message, "error");
        return;
      }
      const { data } = supabase.storage.from("service-images").getPublicUrl(fileName);
      set(key, data.publicUrl);
      showToast("Photo uploaded. Click “Save changes” to put it on the website.");
    } catch (e: unknown) {
      showToast("Could not process this photo.", "error");
    } finally {
      setUploadingKey(null);
    }
  };

  const changedKeys = Object.keys(values).filter((k) => values[k] !== saved[k]);

  const save = async () => {
    if (!changedKeys.length) return;
    setSaving(true);
    const rows = changedKeys.map((key) => ({ key, value: values[key], updated_at: new Date().toISOString() }));
    const { error } = await supabase.from("site_content").upsert(rows, { onConflict: "key" });
    setSaving(false);
    if (error) {
      showToast("Saving failed: " + error.message, "error");
    } else {
      setSaved({ ...values });
      showToast("Saved! The website shows the changes within a minute.");
    }
  };

  const resetField = (key: string) => set(key, DEFAULT_CONTENT[key] ?? "");

  if (loading) return <p style={{ color: "var(--cream-muted)" }}>Loading…</p>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Website</h1>
          <p className={styles.sub}>
            Change the texts and photos on the home page. Opening hours, address and contact
            details are fixed in the code — ask your developer to change those.
          </p>
        </div>
        <button className="btn btn-primary" onClick={save} disabled={saving || !changedKeys.length}>
          {saving ? "Saving…" : changedKeys.length ? `Save changes (${changedKeys.length})` : "Saved"}
        </button>
      </div>

      {CONTENT_GROUPS.map((group) => (
        <section key={group.title} className={`card ${styles.formCard}`} style={{ padding: "24px" }}>
          <h2 className={styles.formTitle}>{group.title}</h2>
          <div style={{ display: "grid", gap: "18px" }}>
            {group.fields.map((f) => (
              <div key={f.key} className="field">
                <label htmlFor={`c-${f.key}`}>{f.label}</label>

                {TRANSLATED_TYPES.includes(f.type) && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
                    {LANGS.map((l) => {
                      const k = langKey(f.key, l);
                      return (
                        <div key={k}>
                          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: "flex", gap: 8 }}>
                            {LANG_NAMES[l]}
                            {values[k] !== (DEFAULT_CONTENT[k] ?? "") && (
                              <button
                                type="button"
                                onClick={() => resetField(k)}
                                style={{ fontSize: 12, fontWeight: 400, background: "none", border: "none", textDecoration: "underline", cursor: "pointer", color: "inherit" }}
                              >
                                back to original
                              </button>
                            )}
                          </div>
                          {f.type === "text" ? (
                            <input id={l === "nl" ? `c-${f.key}` : undefined} type="text" value={values[k] ?? ""} onChange={(e) => set(k, e.target.value)} />
                          ) : (
                            <textarea id={l === "nl" ? `c-${f.key}` : undefined} rows={4} value={values[k] ?? ""} onChange={(e) => set(k, e.target.value)} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {f.type === "image" && (
                  <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ width: 120, height: 120, borderRadius: 12, overflow: "hidden", background: "var(--bg-raised, #eee)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {values[f.key] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={values[f.key]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <span style={{ fontSize: 12, opacity: 0.6 }}>no photo</span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <label className="btn btn-outline btn-sm" style={{ cursor: "pointer" }}>
                        {uploadingKey === f.key ? "Uploading…" : "Choose photo"}
                        <input
                          id={`c-${f.key}`}
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          disabled={uploadingKey !== null}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) uploadImage(f.key, file);
                            e.target.value = "";
                          }}
                        />
                      </label>
                      {values[f.key] && (
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => set(f.key, "")}>
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 40 }}>
        <button className="btn btn-primary" onClick={save} disabled={saving || !changedKeys.length}>
          {saving ? "Saving…" : changedKeys.length ? `Save changes (${changedKeys.length})` : "Saved"}
        </button>
      </div>

      {toast && (
        <div
          role="status"
          style={{
            position: "fixed", bottom: 24, right: 24, padding: "12px 18px", borderRadius: 10, zIndex: 50,
            background: toast.type === "error" ? "#8b2c2c" : "#3a2e28", color: "#fff", fontSize: 14,
            boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
          }}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
