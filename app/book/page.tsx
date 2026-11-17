"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase, type Service, type Availability } from "@/lib/supabase";
import { salonToday, addDays, salonToISO, freeSlots, type BusyBlock } from "@/lib/time";
import styles from "./page.module.css";

const STEPS = ["Service", "Date & Time", "Your Info", "Confirm"];
const DAYS_AHEAD = 14;

// Dates are based on Suriname's calendar, so the label and the booked day always match.
function getBookableDays(): { date: Date; label: string; value: string }[] {
  const today = salonToday();
  const days = [];
  for (let i = 1; i <= DAYS_AHEAD; i++) {
    const value = addDays(today, i);
    // Local noon on that calendar date: getDay() is correct in any time zone
    const date = new Date(`${value}T12:00:00`);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    days.push({ date, label: `${dayName} ${label}`, value });
  }
  return days;
}

// Busy time blocks on a day (no personal data, just start + length)
async function fetchBusy(day: string): Promise<BusyBlock[]> {
  const { data, error } = await supabase.rpc("get_booked_slots", { day });
  if (error) throw error;
  return (data ?? []) as BusyBlock[];
}

function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  // Multi-select: array of selected services
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  // Availability stored fresh on step 1 entry
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loadingAvail, setLoadingAvail] = useState(false);
  const [busy, setBusy] = useState<BusyBlock[]>([]);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientNote, setClientNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const days = getBookableDays();

  // ── Fetch services once on mount ─────────────────────────────────
  useEffect(() => {
    const fetchServices = async () => {
      const { data: svcs } = await supabase
        .from("services")
        .select("*")
        .eq("active", true)
        .order("category")
        .order("price");
      setServices(svcs ?? []);

      // Pre-select service from query param
      const preselected = searchParams.get("service");
      if (preselected && svcs) {
        const found = svcs.find((s: Service) => s.id === preselected);
        if (found) {
          setSelectedServices([found]);
          setStep(1);
        }
      }
    };
    fetchServices();
  }, [searchParams]);

  // ── Fetch availability FRESH every time step 1 becomes active ────
  useEffect(() => {
    if (step !== 1) return;
    const fetchAvail = async () => {
      setLoadingAvail(true);
      const { data } = await supabase.from("availability").select("*");
      setAvailability(data ?? []);
      setLoadingAvail(false);
    };
    fetchAvail();
  }, [step]);

  // Derive closed days and blocked dates from fresh availability
  const closedDays = availability
    .filter((a) => a.day_of_week !== null && a.is_closed)
    .map((a) => a.day_of_week as number);

  const blockedDates = availability
    .filter((a) => a.specific_date !== null && a.is_closed)
    .map((a) => a.specific_date as string);

  // Services are done one after another, so the appointment needs the TOTAL time
  const totalDuration = Math.max(
    15,
    selectedServices.reduce((sum, s) => sum + (s.duration_minutes || 0), 0)
  );

  // Opening hours for a date (specific override wins over the weekly schedule)
  const hoursFor = (day: string): { open: string; close: string } | null => {
    const specific = availability.find((a) => a.specific_date === day);
    if (specific) return specific.is_closed ? null : { open: specific.open_time, close: specific.close_time };
    const dow = new Date(`${day}T12:00:00`).getDay();
    const weekly = availability.find((a) => a.day_of_week === dow);
    if (!weekly || weekly.is_closed) return null;
    return { open: weekly.open_time, close: weekly.close_time };
  };

  // ── Load booked times whenever the date changes ───────────────────
  useEffect(() => {
    if (!selectedDate) return;
    let cancelled = false;
    setBusy([]);
    fetchBusy(selectedDate)
      .then((b) => { if (!cancelled) setBusy(b); })
      .catch(() => { if (!cancelled) setError("Could not load the agenda. Please refresh the page."); });
    return () => { cancelled = true; };
  }, [selectedDate]);

  // ── Free time slots: opening hours minus already-booked times ─────
  useEffect(() => {
    if (!selectedDate || selectedServices.length === 0) return;
    const hours = hoursFor(selectedDate);
    setAvailableSlots(hours ? freeSlots(hours.open, hours.close, totalDuration, busy) : []);
    setSelectedTime("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedServices, availability, busy]);

  // ── Toggle service selection ──────────────────────────────────────
  const toggleService = (s: Service) => {
    setSelectedServices((prev) => {
      const exists = prev.find((x) => x.id === s.id);
      if (exists) return prev.filter((x) => x.id !== s.id);
      return [...prev, s];
    });
  };

  // ── Submit: one appointment row per service ───────────────────────
  const handleSubmit = async () => {
    if (!selectedServices.length || !selectedDate || !selectedTime || !clientName || !clientPhone) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError("");

    // Check again right before saving: someone else may have just booked this time
    try {
      const latestBusy = await fetchBusy(selectedDate);
      const hours = hoursFor(selectedDate);
      const stillFree = hours
        ? freeSlots(hours.open, hours.close, totalDuration, latestBusy).includes(selectedTime)
        : false;
      if (!stillFree) {
        setBusy(latestBusy);
        setLoading(false);
        setError("Sorry, this time was just booked by someone else. Please choose another time.");
        setStep(1);
        return;
      }
    } catch {
      setLoading(false);
      setError("Something went wrong. Please try again.");
      return;
    }

    const dateTime = salonToISO(selectedDate, selectedTime);

    // Insert one row per service (same start time = one booking in the admin)
    const rows = selectedServices.map((svc) => ({
      client_name: clientName.trim(),
      client_phone: clientPhone.trim(),
      service_id: svc.id,
      date_time: dateTime,
      status: "pending",
      paid: false,
      notes: clientNote.trim() || null,
    }));

    const { error: dbError } = await supabase.from("appointments").insert(rows);
    setLoading(false);
    if (dbError) {
      setError("Something went wrong. Please try again.");
    } else {
      router.push("/book/success");
    }
  };


  const categories = [...new Set(services.map((s) => s.category))];
  const totalPrice = selectedServices.reduce(
    (sum, s) => sum + (s.deal_price ?? s.price),
    0
  );

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className="container">
          <p className={styles.eyebrow}>Online booking</p>
          <h1 className={styles.title}>Book an Appointment</h1>
        </div>
      </div>

      {/* Step indicator */}
      <div className={styles.steps}>
        <div className="container">
          <div className={styles.stepsInner}>
            {STEPS.map((s, i) => (
              <div key={s} className={`${styles.step} ${i === step ? styles.stepActive : ""} ${i < step ? styles.stepDone : ""}`}>
                <span className={styles.stepNum}>{i < step ? "✓" : i + 1}</span>
                <span className={styles.stepLabel}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`container ${styles.content}`}>
        {error && <p className={styles.error}>{error}</p>}

        {/* ── Step 0: Service selection (multi-select) ── */}
        {step === 0 && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Choose Services</h2>
            <p className={styles.stepSub}>
              You can select <strong>multiple services</strong> for the same appointment.
            </p>
            {categories.map((cat) => (
              <div key={cat} className={styles.catGroup}>
                <p className={styles.catLabel}>{cat}</p>
                  <div className={styles.magazineServiceGrid}>
                    {services.filter((s) => s.category === cat).map((s) => {
                      const isSelected = !!selectedServices.find((x) => x.id === s.id);
                      return (
                        <button
                          key={s.id}
                          id={`service-${s.id}`}
                          className={`${styles.magazineCard} ${isSelected ? styles.magazineCardSelected : ""}`}
                          onClick={() => toggleService(s)}
                        >
                          <div className={styles.magazineImageWrap}>
                            <div className={styles.magazineImageInner}>
                              {s.image_url ? (
                                <img src={s.image_url} alt={s.name} className={styles.magazineImg} />
                              ) : (
                                <div className={styles.magazineImagePlaceholder}></div>
                              )}
                            </div>
                            <div className={styles.magazinePriceBadge}>
                              {s.deal_price ? (
                                <>
                                  <span style={{ textDecoration: "line-through", opacity: 0.5, fontSize: "10px", marginRight: "4px" }}>{s.price}</span>
                                  {s.deal_price}
                                </>
                              ) : (
                                s.price
                              )}
                            </div>
                          </div>
                          
                          <div className={styles.magazineContent}>
                            <div className={styles.magazineCheck}>
                              {isSelected ? (
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                  <circle cx="10" cy="10" r="10" fill="var(--gold)" />
                                  <path d="M6 10l3 3 5-6" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              ) : (
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                  <circle cx="10" cy="10" r="9.5" fill="none" stroke="rgba(245,241,232,0.2)" />
                                </svg>
                              )}
                            </div>
                            <h3 className={styles.magazineName}>{s.name}</h3>
                            <p className={styles.magazineMeta}>~{s.duration_minutes} min duration</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
              </div>
            ))}

            {/* Sticky continue bar */}
            {selectedServices.length > 0 && (
              <div className={styles.stickyBar}>
                <div className={styles.stickyBarInfo}>
                  <span className={styles.stickyBarCount}>
                    {selectedServices.length} service{selectedServices.length > 1 ? "s" : ""} selected
                  </span>
                  <span className={styles.stickyBarPrice}>Total: SRD {totalPrice.toLocaleString()}</span>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => setStep(1)}
                  id="continue-to-date"
                >
                  Continue →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Step 1: Date & Time ── */}
        {step === 1 && selectedServices.length > 0 && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Pick a Date & Time</h2>
            <p className={styles.stepSub}>
              {selectedServices.length === 1
                ? <>Selected: <strong>{selectedServices[0].name}</strong></>
                : <><strong>{selectedServices.length} services</strong> — {selectedServices.map(s => s.name).join(", ")}</>
              }
            </p>

            {loadingAvail ? (
              <p style={{ color: "var(--cream-dim)", fontSize: "14px" }}>Loading schedule…</p>
            ) : (
              <>
                <div className={styles.field}>
                  <p className={styles.fieldLabel}>Date</p>
                  <div className={styles.dateGrid}>
                    {days.map(({ value, label, date }) => {
                      const dow = date.getDay();
                      const isWeeklyClosed = closedDays.includes(dow);
                      const isBlocked = blockedDates.includes(value);
                      const isClosed = isWeeklyClosed || isBlocked;
                      return (
                        <button
                          key={value}
                          disabled={isClosed}
                          className={`${styles.dateChip} ${selectedDate === value ? styles.dateSelected : ""} ${isClosed ? styles.dateClosed : ""}`}
                          onClick={() => setSelectedDate(value)}
                          id={`date-${value}`}
                        >
                          {label}
                          {isClosed && <span className={styles.closedTag}>Closed</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedDate && (
                  <div className={styles.field} style={{ marginTop: "28px" }}>
                    <p className={styles.fieldLabel}>Time</p>
                    {availableSlots.length === 0 ? (
                      <p className={styles.noSlots}>No slots available for this date.</p>
                    ) : (
                      <div className={styles.timeGrid}>
                        {availableSlots.map((t) => (
                          <button
                            key={t}
                            id={`time-${t}`}
                            className={`${styles.timeChip} ${selectedTime === t ? styles.timeSelected : ""}`}
                            onClick={() => setSelectedTime(t)}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            <div className={styles.navRow}>
              <button className="btn btn-ghost" onClick={() => setStep(0)}>← Back</button>
              <button
                className="btn btn-primary"
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep(2)}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Client info + note ── */}
        {step === 2 && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Your Details</h2>
            <div className={styles.formFields}>
              <div className="field">
                <label htmlFor="client-name">Full Name</label>
                <input
                  id="client-name"
                  type="text"
                  placeholder="e.g. Maria Lopes"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="client-phone">Phone / WhatsApp</label>
                <input
                  id="client-phone"
                  type="tel"
                  placeholder="+597 ..."
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="client-note">
                  Note for the salon <span style={{ color: "var(--cream-muted)", fontWeight: 400 }}>(optional)</span>
                </label>
                <textarea
                  id="client-note"
                  placeholder="Allergies, preferences, special requests…"
                  value={clientNote}
                  onChange={(e) => setClientNote(e.target.value)}
                  rows={3}
                  style={{
                    resize: "vertical",
                    minHeight: "80px",
                  }}
                />
              </div>
            </div>
            <div className={styles.navRow}>
              <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
              <button
                className="btn btn-primary"
                disabled={!clientName.trim() || !clientPhone.trim()}
                onClick={() => setStep(3)}
              >
                Review →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Confirm ── */}
        {step === 3 && selectedServices.length > 0 && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Confirm Booking</h2>
            <div className={`card ${styles.summary}`}>
              {/* Services list */}
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Service{selectedServices.length > 1 ? "s" : ""}</span>
                <span className={styles.summaryValue}>
                  {selectedServices.length === 1
                    ? selectedServices[0].name
                    : (
                      <ul style={{ margin: 0, padding: 0, listStyle: "none", textAlign: "right" }}>
                        {selectedServices.map((s) => (
                          <li key={s.id} style={{ marginBottom: "4px" }}>{s.name}</li>
                        ))}
                      </ul>
                    )
                  }
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Date</span>
                <span className={styles.summaryValue}>
                  {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
                    weekday: "long", year: "numeric", month: "long", day: "numeric",
                  })}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Time</span>
                <span className={styles.summaryValue}>{selectedTime}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Name</span>
                <span className={styles.summaryValue}>{clientName}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Phone</span>
                <span className={styles.summaryValue}>{clientPhone}</span>
              </div>
              {clientNote.trim() && (
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Note</span>
                  <span className={styles.summaryValue} style={{ fontStyle: "italic", color: "var(--cream-dim)" }}>
                    {clientNote}
                  </span>
                </div>
              )}
              <div className={styles.summaryRow} style={{ paddingTop: "16px", borderTop: "1px solid rgba(245,241,232,0.1)" }}>
                <span className={styles.summaryLabel}>Total</span>
                <span className={styles.summaryPrice}>SRD {totalPrice.toLocaleString()}</span>
              </div>
            </div>
            <p className={styles.paymentNote}>
              💳 Payment is cash or bank wire upon arrival.
            </p>
            <div className={styles.navRow}>
              <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} id="confirm-booking">
                {loading ? "Booking…" : "Confirm Booking"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div style={{ padding: "200px 0", textAlign: "center", color: "var(--cream-dim)" }}>Loading...</div>}>
      <BookingForm />
    </Suspense>
  );
}
