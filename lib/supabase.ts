import { createClient } from "@supabase/supabase-js";
import { salonDateOf } from "./time";

// Set to true to use LocalStorage/mock database, or false to use a live Supabase project
const USE_LOCAL_MOCK = true;

// -------------------------------------------------------------
// Real Supabase Client Configuration
// -------------------------------------------------------------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
const realSupabase = !USE_LOCAL_MOCK && typeof window !== "undefined" && supabaseUrl && supabaseUrl.startsWith("http")
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storageKey: 'sb-auth-token',
        storage: {
          getItem: (key) => {
            if (typeof document === 'undefined') return null;
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${key}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
            return null;
          },
          setItem: (key, value) => {
            if (typeof document === 'undefined') return;
            document.cookie = `${key}=${value}; path=/; max-age=31536000; SameSite=Lax; Secure`;
          },
          removeItem: (key) => {
            if (typeof document === 'undefined') return;
            document.cookie = `${key}=; path=/; max-age=-1`;
          }
        }
      }
    })
  : (null as any);

// -------------------------------------------------------------
// Shared Types
// -------------------------------------------------------------
export type ServiceStatus = "pending" | "confirmed" | "done" | "cancelled";

export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  deal_price: number | null;
  active: boolean;
  duration_minutes: number;
  image_url?: string | null;
}

export interface Appointment {
  id: string;
  client_name: string;
  client_phone: string;
  service_id: string;
  date_time: string;
  status: ServiceStatus;
  paid: boolean;
  notes?: string | null;
  services?: Service;
}

export interface Availability {
  id: string;
  day_of_week: number | null;
  specific_date: string | null;
  open_time: string;
  close_time: string;
  is_closed: boolean;
}

// -------------------------------------------------------------
// Default Seed Data
// -------------------------------------------------------------
const DEFAULT_SERVICES: Service[] = [
  { id: "s1", name: "Classic Facial", category: "Facials", price: 550, deal_price: null, active: true, duration_minutes: 60, image_url: "https://images.unsplash.com/photo-1570172619644-def2d4e680a6?w=400&q=80" },
  { id: "s2", name: "Vitamin C Treatment", category: "Facials", price: 750, deal_price: null, active: true, duration_minutes: 75, image_url: null },
  { id: "s3", name: "Dermaplaning", category: "Facials", price: 975, deal_price: null, active: true, duration_minutes: 90, image_url: "https://images.unsplash.com/photo-1570172619644-def2d4e680a6?w=400&q=80" },
  { id: "s4", name: "Russian Pedicure", category: "Mani / Pedi", price: 550, deal_price: null, active: true, duration_minutes: 90, image_url: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&q=80" },
  { id: "s5", name: "Spa Pedicure", category: "Mani / Pedi", price: 750, deal_price: null, active: true, duration_minutes: 90, image_url: null },
  { id: "s6", name: "Pedicure + Gellak", category: "Mani / Pedi", price: 850, deal_price: null, active: true, duration_minutes: 105, image_url: null },
  { id: "s7", name: "Manicure", category: "Mani / Pedi", price: 350, deal_price: null, active: true, duration_minutes: 45, image_url: null },
  { id: "s8", name: "Manicure + Gellak", category: "Mani / Pedi", price: 600, deal_price: null, active: true, duration_minutes: 60, image_url: null },
  { id: "s9", name: "Eyebrows", category: "Waxing", price: 200, deal_price: null, active: true, duration_minutes: 15, image_url: null },
  { id: "s10", name: "Sideburns", category: "Waxing", price: 150, deal_price: null, active: true, duration_minutes: 10, image_url: null },
  { id: "s11", name: "Upper Lip", category: "Waxing", price: 100, deal_price: null, active: true, duration_minutes: 10, image_url: null },
  { id: "s12", name: "Chin", category: "Waxing", price: 200, deal_price: null, active: true, duration_minutes: 10, image_url: null },
  { id: "s13", name: "Beard", category: "Waxing", price: 350, deal_price: null, active: true, duration_minutes: 20, image_url: null },
  { id: "s14", name: "Full Face", category: "Waxing", price: 350, deal_price: null, active: true, duration_minutes: 30, image_url: null },
  { id: "s15", name: "Underarms", category: "Waxing", price: 250, deal_price: null, active: true, duration_minutes: 15, image_url: null },
  { id: "s16", name: "Brazilian", category: "Waxing", price: 550, deal_price: null, active: true, duration_minutes: 45, image_url: null },
  { id: "s17", name: "Lower Arm", category: "Waxing", price: 300, deal_price: null, active: true, duration_minutes: 20, image_url: null },
  { id: "s18", name: "Full Arm", category: "Waxing", price: 400, deal_price: null, active: true, duration_minutes: 30, image_url: null },
  { id: "s19", name: "Toes", category: "Waxing", price: 100, deal_price: null, active: true, duration_minutes: 10, image_url: null },
  { id: "s20", name: "Lower Leg", category: "Waxing", price: 450, deal_price: null, active: true, duration_minutes: 30, image_url: null },
  { id: "s21", name: "Full Leg", category: "Waxing", price: 600, deal_price: null, active: true, duration_minutes: 45, image_url: null },
  { id: "s22", name: "Ombre Powder Brows (incl. touch-up)", category: "PMU", price: 2500, deal_price: null, active: true, duration_minutes: 180, image_url: null },
  { id: "s23", name: "Lipblush (incl. touch-up)", category: "PMU", price: 2500, deal_price: null, active: true, duration_minutes: 180, image_url: null }
];

const DEFAULT_AVAILABILITY: Availability[] = [
  { id: "a0", day_of_week: 0, specific_date: null, open_time: "10:00", close_time: "19:00", is_closed: true },
  { id: "a1", day_of_week: 1, specific_date: null, open_time: "10:00", close_time: "19:00", is_closed: true },
  { id: "a2", day_of_week: 2, specific_date: null, open_time: "10:00", close_time: "19:00", is_closed: false },
  { id: "a3", day_of_week: 3, specific_date: null, open_time: "10:00", close_time: "19:00", is_closed: false },
  { id: "a4", day_of_week: 4, specific_date: null, open_time: "10:00", close_time: "19:00", is_closed: false },
  { id: "a5", day_of_week: 5, specific_date: null, open_time: "10:00", close_time: "19:00", is_closed: false },
  { id: "a6", day_of_week: 6, specific_date: null, open_time: "10:00", close_time: "19:00", is_closed: false }
];

// -------------------------------------------------------------
// Client Browser Storage Helpers
// -------------------------------------------------------------
const isBrowser = typeof window !== "undefined";

const getLocal = <T>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(data);
  } catch {
    return fallback;
  }
};

const setLocal = <T>(key: string, value: T) => {
  if (isBrowser) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const getServices = () => getLocal<Service[]>("aim_n_more_services", DEFAULT_SERVICES);
const getAvailability = () => getLocal<Availability[]>("aim_n_more_availability", DEFAULT_AVAILABILITY);
const getAppointments = () => getLocal<Appointment[]>("aim_n_more_appointments", []);
const getSession = () => getLocal<any>("aim_n_more_session", null);

// -------------------------------------------------------------
// Mock Query Builder
// -------------------------------------------------------------
class MockQueryBuilder {
  private table: string;
  private filters: ((item: any) => boolean)[] = [];
  private sorts: { col: string; asc: boolean }[] = [];
  private operation: { type: "select" | "insert" | "update" | "delete"; payload?: any } = { type: "select" };

  constructor(table: string) {
    this.table = table;
  }

  select(fields?: string) {
    this.operation.type = "select";
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push((item) => item[column] === value);
    return this;
  }

  not(column: string, operator: string, value: any) {
    if (operator === "is" && value === null) {
      this.filters.push((item) => item[column] !== null && item[column] !== undefined);
    }
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.sorts.push({ col: column, asc: options?.ascending !== false });
    return this;
  }

  insert(payload: any) {
    this.operation = { type: "insert", payload };
    return this;
  }

  update(payload: any) {
    this.operation = { type: "update", payload };
    return this;
  }

  delete() {
    this.operation = { type: "delete" };
    return this;
  }

  async single() {
    const res = await this.execute();
    return { data: res[0] || null, error: res[0] ? null : { message: "Not found" } };
  }

  async maybeSingle() {
    const res = await this.execute();
    return { data: res[0] || null, error: null };
  }

  then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    return this.execute().then(
      (data) => {
        const result = { data, error: null };
        return onfulfilled ? onfulfilled(result) : result;
      },
      onrejected
    );
  }

  private async execute() {
    let data: any[] = [];
    if (this.table === "services") data = getServices();
    else if (this.table === "availability") data = getAvailability();
    else if (this.table === "appointments") {
      const appts = getAppointments();
      const svcs = getServices();
      data = appts.map((a) => ({ ...a, services: svcs.find((s) => s.id === a.service_id) }));
    }

    if (this.operation.type === "insert") {
      const items = Array.isArray(this.operation.payload)
        ? this.operation.payload : [this.operation.payload];
      const newItems = items.map((item: any) => ({
        id: item.id || Math.random().toString(36).substring(2, 11),
        created_at: new Date().toISOString(),
        ...item,
      }));
      if (this.table === "services") setLocal("aim_n_more_services", [...getServices(), ...newItems]);
      else if (this.table === "availability") setLocal("aim_n_more_availability", [...getAvailability(), ...newItems]);
      else if (this.table === "appointments") setLocal("aim_n_more_appointments", [...getAppointments(), ...newItems]);
      return newItems;
    }

    let result = [...data];
    for (const filter of this.filters) result = result.filter(filter);

    if (this.operation.type === "update") {
      const ids = result.map((r) => r.id);
      if (this.table === "services")
        setLocal("aim_n_more_services", getServices().map((item) => ids.includes(item.id) ? { ...item, ...this.operation.payload } : item));
      else if (this.table === "availability")
        setLocal("aim_n_more_availability", getAvailability().map((item) => ids.includes(item.id) ? { ...item, ...this.operation.payload } : item));
      else if (this.table === "appointments")
        setLocal("aim_n_more_appointments", getAppointments().map((item) => ids.includes(item.id) ? { ...item, ...this.operation.payload } : item));
      return result.map((r) => ({ ...r, ...this.operation.payload }));
    }

    if (this.operation.type === "delete") {
      const ids = result.map((r) => r.id);
      if (this.table === "services") setLocal("aim_n_more_services", getServices().filter((item) => !ids.includes(item.id)));
      else if (this.table === "availability") setLocal("aim_n_more_availability", getAvailability().filter((item) => !ids.includes(item.id)));
      else if (this.table === "appointments") setLocal("aim_n_more_appointments", getAppointments().filter((item) => !ids.includes(item.id)));
      return result;
    }

    if (this.sorts.length) {
      result.sort((a, b) => {
        for (const { col, asc } of this.sorts) {
          if (a[col] < b[col]) return asc ? -1 : 1;
          if (a[col] > b[col]) return asc ? 1 : -1;
        }
        return 0;
      });
    }
    return result;
  }
}

// -------------------------------------------------------------
// Mock Supabase Client Object
// -------------------------------------------------------------
const mockSupabase = {
  auth: {
    async getSession() {
      const session = getSession();
      return { data: { session }, error: null };
    },
    async signInWithPassword({ email, password }: any) {
      if (email === "admin@aimnmore.com" && password === "admin123") {
        const mockSession = {
          user: { id: "admin-user", email },
          access_token: "mock-token",
          expires_at: Math.floor(Date.now() / 1000) + 3600,
        };
        setLocal("aim_n_more_session", mockSession);
        if (typeof document !== 'undefined') {
          document.cookie = `sb-auth-token=${encodeURIComponent(JSON.stringify(mockSession))}; path=/; max-age=3600; SameSite=Lax`;
        }
        return { data: { session: mockSession }, error: null };
      }
      return { data: { session: null }, error: { message: "Invalid credentials" } };
    },
    async signOut() {
      setLocal("aim_n_more_session", null);
      if (typeof document !== 'undefined') {
        document.cookie = `sb-auth-token=; path=/; max-age=-1`;
      }
      return { error: null };
    },
    async resetPasswordForEmail(email: string, options?: any) {
      return { data: {}, error: null };
    },
    async updateUser({ password }: any) {
      return { data: {}, error: null };
    }
  },
  from(table: string) {
    return new MockQueryBuilder(table);
  },
  // Mirrors the get_booked_slots() SQL function: busy blocks on one Suriname day
  async rpc(fn: string, args: any) {
    if (fn !== "get_booked_slots") return { data: null, error: { message: `Unknown function ${fn}` } };
    const svcs = getServices();
    const groups = new Map<string, { start_time: string; duration_minutes: number }>();
    for (const a of getAppointments()) {
      if (a.status === "cancelled") continue;
      if (salonDateOf(a.date_time) !== args.day) continue;
      const key = `${a.client_phone}__${a.date_time}`;
      const dur = svcs.find((s) => s.id === a.service_id)?.duration_minutes ?? 60;
      const g = groups.get(key);
      if (g) g.duration_minutes += dur;
      else groups.set(key, { start_time: a.date_time, duration_minutes: dur });
    }
    return { data: [...groups.values()], error: null };
  },
  storage: {
    from(bucket: string) {
      return {
        async upload(path: string, file: any) {
          return { data: { path }, error: null };
        },
        getPublicUrl(path: string) {
          return { data: { publicUrl: `https://picsum.photos/400/300?random=${Math.random()}` } };
        }
      };
    },
    async createBucket(id: string, options?: any) {
      return { data: { name: id }, error: null };
    }
  }
};


// -------------------------------------------------------------
// Active client exports
// -------------------------------------------------------------
export const supabase = USE_LOCAL_MOCK ? (mockSupabase as any) : realSupabase;
