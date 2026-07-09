"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase, type Availability } from "@/lib/supabase";
import styles from "./page.module.css";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function AdminAvailabilityPage() {
  const [hours, setHours] = useState<Availability[]>([]);
  const [blocked, setBlocked] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Blocked date form
  const [newDate, setNewDate] = useState("");

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("availability").select("*").order("day_of_week");
    const h = (data ?? []).filter((a: Availability) => a.day_of_week !== null);
    const b = (data ?? []).filter((a: Availability) => a.specific_date !== null);
    // Sort weekly hours by day
    h.sort((a: Availability, b: Availability) => (a.day_of_week ?? 0) - (b.day_of_week ?? 0));
    setHours(h);
    setBlocked(b);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const updateHour = (id: string, field: keyof Availability, value: string | boolean) => {
    setHours((prev) => prev.map((h) => h.id === id ? { ...h, [field]: value } : h));
  };

  const saveHour = async (h: Availability) => {
    setSaving(h.id);
    await supabase.from("availability").update({
      open_time: h.open_time,
      close_time: h.close_time,
      is_closed: h.is_closed,
    }).eq("id", h.id);
    setSaving(null);
    showToast("Hours saved!");
  };

  const addBlockedDate = async () => {
    if (!newDate) return;
    const { error } = await supabase.from("availability").insert({
      specific_date: newDate,
      open_time: "10:00",
      close_time: "19:00",
      is_closed: true,
    });
    if (error) { showToast("Failed to add blocked date.", "error"); return; }
    setNewDate("");
    showToast("Date blocked!");
    fetchAll();
  };

  const removeBlocked = async (id: string) => {
    await supabase.from("availability").delete().eq("id", id);
    setBlocked((prev) => prev.filter((b) => b.id !== id));
    showToast("Date unblocked.");
  };

  return (
    <div className={styles.page}>
      {toast && (
        <div className={`toast toast--${toast.type}`}>{toast.msg}</div>
      )}

      <div className={styles.header}>
        <h1 className={styles.title}>Availability</h1>
        <p className={styles.sub}>Set working hours and block off dates</p>
      </div>

      {loading ? (
        <p style={{ color: "var(--cream-dim)" }}>Loading…</p>
      ) : (
        <>
          {/* Weekly hours */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Weekly Hours</h2>
            <div className={styles.hoursList}>
              {hours.map((h) => (
                <div key={h.id} className={`card ${styles.hourRow}`}>
                  <span className={styles.dayName}>
                    {DAY_NAMES[h.day_of_week ?? 0]}
                  </span>

                  <label className={styles.closedToggle}>
                    <input
                      type="checkbox"
                      checked={h.is_closed}
                      onChange={(e) => updateHour(h.id, "is_closed", e.target.checked)}
                      style={{ accentColor: "var(--gold)" }}
                      id={`closed-${h.id}`}
                    />
                    Closed
                  </label>

                  {!h.is_closed && (
                    <>
                      <div className={styles.timeInput}>
                        <label htmlFor={`open-${h.id}`}>Open</label>
                        <input
                          id={`open-${h.id}`}
                          type="time"
                          value={h.open_time}
                          onChange={(e) => updateHour(h.id, "open_time", e.target.value)}
                        />
                      </div>
                      <div className={styles.timeInput}>
                        <label htmlFor={`close-${h.id}`}>Close</label>
                        <input
                          id={`close-${h.id}`}
                          type="time"
                          value={h.close_time}
                          onChange={(e) => updateHour(h.id, "close_time", e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  <button
                    id={`save-hours-${h.id}`}
                    className="btn btn-outline btn-sm"
                    onClick={() => saveHour(h)}
                    disabled={saving === h.id}
                    style={{ marginLeft: "auto" }}
                  >
                    {saving === h.id ? "Saving…" : "Save"}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Blocked dates */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Blocked Dates</h2>
            <p className={styles.sectionSub}>
              Block off specific dates (holidays, vacations, etc.). Clients won&apos;t be able to book on these days.
            </p>

            <div className={styles.addBlockRow}>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                id="new-blocked-date"
                min={new Date().toISOString().split("T")[0]}
                style={{
                  background: "var(--black-light)",
                  border: "1px solid rgba(245,241,232,0.1)",
                  borderRadius: "var(--radius-sm)",
                  padding: "10px 14px",
                  color: "var(--cream)",
                  fontSize: "14px",
                }}
              />
              <button
                id="block-date"
                className="btn btn-primary btn-sm"
                onClick={addBlockedDate}
                disabled={!newDate}
              >
                Block Date
              </button>
            </div>

            {blocked.length === 0 ? (
              <p className={styles.noBlocked}>No dates blocked.</p>
            ) : (
              <div className={styles.blockedList}>
                {blocked.map((b) => (
                  <div key={b.id} className={`card ${styles.blockedItem}`}>
                    <span className={styles.blockedDate}>
                      {new Date(b.specific_date + "T12:00:00").toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <button
                      id={`unblock-${b.id}`}
                      className="btn btn-danger btn-sm"
                      onClick={() => removeBlocked(b.id)}
                    >
                      Unblock
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
