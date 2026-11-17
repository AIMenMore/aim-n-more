// All salon times are Suriname time (UTC-3, no daylight saving),
// no matter where the visitor's phone or laptop is.
export const SALON_TZ = "America/Paramaribo";
const SALON_OFFSET = "-03:00";

/** Today's date in Suriname as YYYY-MM-DD. */
export function salonToday(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: SALON_TZ });
}

/** Add whole days to a YYYY-MM-DD date string. */
export function addDays(ymd: string, n: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

/** Salon date + "HH:MM" → ISO timestamp (UTC). */
export function salonToISO(ymd: string, hhmm: string): string {
  return new Date(`${ymd}T${hhmm}:00${SALON_OFFSET}`).toISOString();
}

/** ISO timestamp → salon date as YYYY-MM-DD. */
export function salonDateOf(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: SALON_TZ });
}

/** ISO timestamp → minutes since midnight, salon time. */
export function salonMinutesOf(iso: string): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: SALON_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return h * 60 + m;
}

/** "HH:MM" (or "HH:MM:SS") → minutes since midnight. */
export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Minutes since midnight → "HH:MM". */
export function fromMinutes(mins: number): string {
  const h = Math.floor(mins / 60).toString().padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

export interface BusyBlock {
  start_time: string; // ISO timestamp
  duration_minutes: number;
}

const SLOT_STEP = 30; // offer a start time every 30 minutes

/**
 * Free start times for a booking of `durationMins`, between open and close,
 * that do not overlap any busy block on that day.
 */
export function freeSlots(
  open: string,
  close: string,
  durationMins: number,
  busy: BusyBlock[]
): string[] {
  const start = toMinutes(open);
  const end = toMinutes(close);
  const blocks = busy.map((b) => {
    const s = salonMinutesOf(b.start_time);
    return [s, s + b.duration_minutes] as const;
  });
  const slots: string[] = [];
  for (let t = start; t + durationMins <= end; t += SLOT_STEP) {
    const overlaps = blocks.some(([bs, be]) => t < be && t + durationMins > bs);
    if (!overlaps) slots.push(fromMinutes(t));
  }
  return slots;
}
