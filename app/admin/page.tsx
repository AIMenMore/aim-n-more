"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase, type Appointment, type ServiceStatus } from "@/lib/supabase";
import styles from "./page.module.css";

const STATUS_OPTIONS: ServiceStatus[] = ["pending", "confirmed", "done", "cancelled"];
const FILTERS: { label: string; value: "all" | ServiceStatus | "today" }[] = [
  { label: "All", value: "all" },
  { label: "Today", value: "today" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Done", value: "done" },
  { label: "Cancelled", value: "cancelled" },
];

// A group = one client booking at one date/time (possibly multiple services)
interface BookingGroup {
  key: string;
  client_name: string;
  client_phone: string;
  date_time: string;
  notes: string | null;
  appointments: Appointment[];
  /** representative status: all same → that value, else "mixed" */
  status: ServiceStatus | "mixed";
  allPaid: boolean;
}

function groupAppointments(appointments: Appointment[]): BookingGroup[] {
  const map = new Map<string, Appointment[]>();
  for (const apt of appointments) {
    // Group by phone + exact date_time
    const key = `${apt.client_phone}__${apt.date_time}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(apt);
  }

  return Array.from(map.entries()).map(([key, apts]) => {
    const statuses = [...new Set(apts.map((a) => a.status))];
    const status: ServiceStatus | "mixed" = statuses.length === 1 ? statuses[0] : "mixed";
    const allPaid = apts.every((a) => a.paid);
    return {
      key,
      client_name: apts[0].client_name,
      client_phone: apts[0].client_phone,
      date_time: apts[0].date_time,
      notes: apts[0].notes ?? null,
      appointments: apts,
      status,
      allPaid,
    };
  });
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    full: d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
  };
}

function isToday(iso: string) {
  return new Date(iso).toDateString() === new Date().toDateString();
}

function toWaLink(phone: string) {
  const cleaned = phone.replace(/[\s\-().]/g, "");
  return `https://wa.me/${cleaned.startsWith("+") ? cleaned.slice(1) : cleaned}`;
}

function WhatsAppIcon() {
  return (
    <svg
      width="13" height="13" viewBox="0 0 24 24" fill="currentColor"
      style={{ marginLeft: "5px", verticalAlign: "middle", flexShrink: 0 }}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | ServiceStatus | "today">("all");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [viewingGroup, setViewingGroup] = useState<BookingGroup | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("appointments")
      .select("*, services(name, category, price, deal_price, duration_minutes)")
      .order("date_time", { ascending: true });
    setAppointments(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  // Update state helpers that keep both the flat list and viewed group in sync
  const updateAptField = (id: string, patch: Partial<Appointment>) => {
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, ...patch } : a));
    setViewingGroup((prev) => {
      if (!prev) return prev;
      const updated = prev.appointments.map((a) => a.id === id ? { ...a, ...patch } : a);
      const statuses = [...new Set(updated.map((a) => a.status))];
      return {
        ...prev,
        appointments: updated,
        status: statuses.length === 1 ? statuses[0] : "mixed",
        allPaid: updated.every((a) => a.paid),
      };
    });
  };

  const updateStatus = async (id: string, status: ServiceStatus) => {
    await supabase.from("appointments").update({ status }).eq("id", id);
    updateAptField(id, { status });
  };

  const updateGroupStatus = async (group: BookingGroup, status: ServiceStatus) => {
    for (const apt of group.appointments) {
      await supabase.from("appointments").update({ status }).eq("id", apt.id);
    }
    group.appointments.forEach((apt) => updateAptField(apt.id, { status }));
  };

  const togglePaid = async (id: string, paid: boolean) => {
    await supabase.from("appointments").update({ paid: !paid }).eq("id", id);
    updateAptField(id, { paid: !paid });
  };

  const handleReschedule = async (group: BookingGroup) => {
    if (!rescheduleDate || !rescheduleTime) return;
    const dt = new Date(`${rescheduleDate}T${rescheduleTime}:00`).toISOString();
    for (const apt of group.appointments) {
      await supabase.from("appointments").update({ date_time: dt, status: "confirmed" }).eq("id", apt.id);
    }
    setEditingKey(null);
    fetchAppointments();
  };

  const cancelGroup = async (group: BookingGroup) => {
    for (const apt of group.appointments) {
      await supabase.from("appointments").update({ status: "cancelled" }).eq("id", apt.id);
    }
    group.appointments.forEach((apt) => updateAptField(apt.id, { status: "cancelled" }));
  };

  // Group and filter
  const groups = groupAppointments(appointments);

  const filtered = groups.filter((g) => {
    if (filter === "today") return isToday(g.date_time);
    if (filter === "all") return true;
    // match if ANY appointment in the group has this status
    return g.appointments.some((a) => a.status === filter);
  });

  const todayCount = groups.filter((g) => isToday(g.date_time)).length;
  const pendingCount = groups.filter((g) => g.appointments.some((a) => a.status === "pending")).length;

  // Compute total price for a group
  const groupTotal = (g: BookingGroup) =>
    g.appointments.reduce((sum, a) => sum + (a.services?.deal_price ?? a.services?.price ?? 0), 0);

  return (
    <div className={styles.page}>

      {/* ── Client Detail Panel ───────────────────────────────── */}
      {viewingGroup && (
        <>
          <div className={styles.overlay} onClick={() => setViewingGroup(null)} />
          <aside className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Client Details</h2>
              <button
                className={styles.panelClose}
                onClick={() => setViewingGroup(null)}
                id="close-panel"
                aria-label="Close"
              >✕</button>
            </div>

            <div className={styles.panelBody}>
              {/* Client */}
              <div className={styles.panelSection}>
                <p className={styles.panelLabel}>Client</p>
                <p className={styles.panelValue}>{viewingGroup.client_name}</p>
              </div>

              <div className={styles.panelSection}>
                <p className={styles.panelLabel}>Phone / WhatsApp</p>
                <a
                  href={toWaLink(viewingGroup.client_phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.waLink}
                  id={`wa-panel-${viewingGroup.key}`}
                >
                  {viewingGroup.client_phone}
                  <WhatsAppIcon />
                </a>
              </div>

              {/* Date & Time */}
              <div className={styles.panelSection}>
                <p className={styles.panelLabel}>Date &amp; Time</p>
                <p className={styles.panelValue}>{formatDateTime(viewingGroup.date_time).full}</p>
                <p className={styles.panelMeta} style={{ color: "var(--gold)" }}>
                  {formatDateTime(viewingGroup.date_time).time}
                </p>
              </div>

              {/* Services — one block per service with individual controls */}
              <div className={styles.panelSection}>
                <p className={styles.panelLabel}>
                  {viewingGroup.appointments.length > 1
                    ? `Services (${viewingGroup.appointments.length})`
                    : "Service"}
                </p>
                <div className={styles.serviceList}>
                  {viewingGroup.appointments.map((apt) => (
                    <div key={apt.id} className={styles.serviceRow}>
                      <div className={styles.serviceRowInfo}>
                        <span className={styles.serviceRowName}>{apt.services?.name ?? "—"}</span>
                        <span className={styles.serviceRowPrice}>
                          SRD {(apt.services?.deal_price ?? apt.services?.price ?? 0).toLocaleString()}
                        </span>
                      </div>
                      <div className={styles.serviceRowControls}>
                        <select
                          className={`badge badge--${apt.status} ${styles.statusSelect}`}
                          value={apt.status}
                          onChange={(e) => updateStatus(apt.id, e.target.value as ServiceStatus)}
                          id={`panel-status-${apt.id}`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <button
                          id={`panel-paid-${apt.id}`}
                          className={`${styles.paidBtn} ${apt.paid ? styles.paidYes : styles.paidNo}`}
                          onClick={() => togglePaid(apt.id, apt.paid)}
                        >
                          {apt.paid ? "✓ Paid" : "Unpaid"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className={styles.panelTotal}>
                  <span className={styles.panelTotalLabel}>Total</span>
                  <span className={styles.panelTotalPrice}>
                    SRD {groupTotal(viewingGroup).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Note */}
              <div className={styles.panelSection}>
                <p className={styles.panelLabel}>Client Note</p>
                {viewingGroup.notes ? (
                  <div className={styles.noteBox}>{viewingGroup.notes}</div>
                ) : (
                  <p className={styles.panelMeta} style={{ fontStyle: "italic" }}>No note left.</p>
                )}
              </div>

              {/* Apply status to ALL services at once */}
              {viewingGroup.appointments.length > 1 && (
                <div className={styles.panelSection}>
                  <p className={styles.panelLabel}>Apply status to all services</p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {STATUS_OPTIONS.map((s) => (
                      <button
                        key={s}
                        className={`badge badge--${s}`}
                        style={{ cursor: "pointer", border: "1px solid currentColor" }}
                        onClick={() => updateGroupStatus(viewingGroup, s)}
                        id={`panel-all-status-${s}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </>
      )}

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Bookings</h1>
          <p className={styles.sub}>Manage all appointments</p>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>{todayCount}</span>
            <span className={styles.statLabel}>Today</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum} style={{ color: "var(--gold)" }}>{pendingCount}</span>
            <span className={styles.statLabel}>Pending</span>
          </div>
        </div>
      </div>

      {/* ── Filters ─────────────────────────────────────────────── */}
      <div className={styles.filters}>
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            id={`filter-${value}`}
            className={`${styles.filterBtn} ${filter === value ? styles.filterActive : ""}`}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Table ───────────────────────────────────────────────── */}
      {loading ? (
        <div className={styles.empty}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>No appointments found.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date &amp; Time</th>
                <th>Client</th>
                <th>Services</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((group) => {
                const { date, time } = formatDateTime(group.date_time);
                const todayFlag = isToday(group.date_time);
                const isCancelled = group.appointments.every((a) => a.status === "cancelled");

                return (
                  <>
                    <tr
                      key={group.key}
                      className={`${styles.row} ${todayFlag ? styles.rowToday : ""}`}
                    >
                      {/* Date & Time */}
                      <td>
                        <span className={styles.date}>{date}</span>
                        <span className={styles.time}>{time}</span>
                        {todayFlag && (
                          <span className="badge badge--confirmed" style={{ fontSize: "9px", padding: "2px 8px" }}>
                            Today
                          </span>
                        )}
                      </td>

                      {/* Client */}
                      <td>
                        <span className={styles.clientName}>{group.client_name}</span>
                        <a
                          href={toWaLink(group.client_phone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.clientPhone}
                          id={`wa-${group.key}`}
                          title="Open in WhatsApp"
                        >
                          {group.client_phone}
                          <WhatsAppIcon />
                        </a>
                        {group.notes && (
                          <span className={styles.noteTag} title={group.notes}>📝 Note</span>
                        )}
                      </td>

                      {/* Services — compact pill list */}
                      <td>
                        <div className={styles.servicePills}>
                          {group.appointments.map((apt) => (
                            <span key={apt.id} className={styles.servicePill}>
                              {apt.services?.name ?? "—"}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Total price */}
                      <td>
                        <span className={styles.groupTotal}>
                          SRD {groupTotal(group).toLocaleString()}
                        </span>
                      </td>

                      {/* Status badge — aggregate */}
                      <td>
                        <span className={`badge badge--${group.status === "mixed" ? "pending" : group.status} ${styles.statusBadge}`}>
                          {group.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className={styles.actions}>
                          <button
                            className="btn btn-ghost btn-sm"
                            id={`view-${group.key}`}
                            onClick={() => setViewingGroup(group)}
                          >
                            View
                          </button>
                          {!isCancelled && (
                            <>
                              <button
                                className="btn btn-ghost btn-sm"
                                id={`reschedule-${group.key}`}
                                onClick={() => setEditingKey(editingKey === group.key ? null : group.key)}
                              >
                                {editingKey === group.key ? "Cancel" : "Reschedule"}
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                id={`cancel-${group.key}`}
                                onClick={() => cancelGroup(group)}
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Reschedule expand row */}
                    {editingKey === group.key && (
                      <tr key={`${group.key}-edit`} className={styles.rescheduleRow}>
                        <td colSpan={6}>
                          <div className={styles.rescheduleForm}>
                            <span className={styles.rescheduleLabel}>New date &amp; time:</span>
                            <input
                              type="date"
                              value={rescheduleDate}
                              onChange={(e) => setRescheduleDate(e.target.value)}
                              style={{ background: "var(--black-light)", border: "1px solid var(--gold-border)", borderRadius: "6px", padding: "6px 10px", color: "var(--cream)", fontSize: "13px" }}
                            />
                            <input
                              type="time"
                              value={rescheduleTime}
                              onChange={(e) => setRescheduleTime(e.target.value)}
                              style={{ background: "var(--black-light)", border: "1px solid var(--gold-border)", borderRadius: "6px", padding: "6px 10px", color: "var(--cream)", fontSize: "13px" }}
                            />
                            <button className="btn btn-primary btn-sm" onClick={() => handleReschedule(group)}>
                              Save
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
