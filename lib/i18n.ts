// Website languages. Add a language by adding it to LANGS and giving every key a text.
export const LANGS = ["nl", "en"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "nl";
export const LANG_COOKIE = "lang";
export const LANG_LABELS: Record<Lang, string> = { nl: "NL", en: "EN" };
export const LOCALES: Record<Lang, string> = { nl: "nl-NL", en: "en-US" };

export function isLang(v: unknown): v is Lang {
  return typeof v === "string" && (LANGS as readonly string[]).includes(v);
}

const dict = {
  // Navigation & footer
  nav_home: { nl: "Home", en: "Home" },
  nav_services: { nl: "Behandelingen", en: "Services" },
  nav_book: { nl: "Boek nu", en: "Book Now" },
  lang_label: { nl: "Taal", en: "Language" },
  footer_tagline: { nl: "Omdat je mooie wenkbrauwen en sexy lippen verdient, elke dag.", en: "Because you deserve good brows and sexy lips, every day." },
  footer_hours: { nl: "Openingstijden", en: "Hours" },
  footer_contact: { nl: "Contact", en: "Contact" },
  footer_follow: { nl: "Volg ons", en: "Follow" },
  footer_email: { nl: "Mail ons", en: "Email us" },
  footer_rights: { nl: "Alle rechten voorbehouden.", en: "All rights reserved." },

  // Business details
  hours_days: { nl: "Ma – Za", en: "Mon – Sat" },
  hours_closed: { nl: "Zondag gesloten", en: "Sunday closed" },
  address_line2: { nl: "Hoek Livorno 4e Dwarsstraat", en: "Corner of Livorno 4e Dwarsstraat" },
  home_service_note: { nl: "Massages aan huis mogelijk vanaf 2 personen.", en: "Home-service massages available for 2 or more people." },
  policy_late: { nl: "10 minuten of meer te laat: SRD 50 boete.", en: "Arriving 10 minutes late or more: SRD 50 late fee." },
  policy_cancelled: { nl: "30 minuten te laat: de afspraak vervalt.", en: "30 minutes late: the appointment is cancelled." },
  policy_notice: { nl: "Afzeggen of verzetten graag minstens 24 uur van tevoren.", en: "Please cancel or reschedule at least 24 hours in advance." },
  payment_methods: { nl: "Contant, overmaking of Uni5Pay+", en: "Cash, bank transfer or Uni5Pay+" },
  payment_reference: { nl: "Aimenmore + behandeling (bijv. “aimenmore brazilian”)", en: "Aimenmore + treatment (e.g. “aimenmore brazilian”)" },

  // Home page (fixed labels)
  home_book: { nl: "Maak een afspraak", en: "Book an Appointment" },
  home_view_services: { nl: "Bekijk behandelingen", en: "View Services" },
  intro_open: { nl: "Open voor afspraken", en: "Open for appointments" },
  intro_hours: { nl: "Openingstijden", en: "Working hours" },
  intro_call: { nl: "Bel of WhatsApp", en: "Call or WhatsApp" },
  studio_label: { nl: "De studio", en: "The Studio" },
  explore_services: { nl: "Alle behandelingen", en: "Explore All Services" },
  featured_label: { nl: "Signature behandelingen", en: "Signature Treatments" },
  featured_title: { nl: "Onze specialiteiten", en: "Our specialties" },
  view_all: { nl: "Bekijk alles →", en: "View all →" },
  book_now: { nl: "Boek nu", en: "Book Now" },
  gallery_label: { nl: "Rechtstreeks uit de studio", en: "Straight From The Studio" },
  gallery_title: { nl: "Het resultaat spreekt", en: "The results speak" },
  gallery_more: { nl: "Meer op Instagram →", en: "See more on Instagram →" },
  reviews_label: { nl: "Klantverhalen", en: "Client Stories" },
  reviews_title: { nl: "Vertrouwd door onze vaste klanten", en: "Trusted by our regulars" },
  good_to_know: { nl: "Goed om te weten", en: "Good to know" },
  payment: { nl: "Betalen", en: "Payment" },
  find_us: { nl: "Hier vind je ons", en: "Find Us" },
  location: { nl: "Locatie", en: "Location" },
  phone_whatsapp: { nl: "Telefoon / WhatsApp", en: "Phone / WhatsApp" },
  socials: { nl: "Socials", en: "Socials" },

  // Services page
  services_eyebrow: { nl: "Wat we doen", en: "What we offer" },
  services_title: { nl: "Onze behandelingen", en: "Our Services" },
  services_prices: { nl: "Alle prijzen in Surinaamse dollars (SRD). Boek online of bel", en: "All prices in Surinamese dollars (SRD). Book online or call" },
  services_empty: { nl: "Er zijn op dit moment geen behandelingen beschikbaar.", en: "No services available at this time." },
  services_cta: { nl: "Zin om jezelf te verwennen?", en: "Ready to treat yourself?" },

  // Booking
  book_eyebrow: { nl: "Online boeken", en: "Online booking" },
  book_title: { nl: "Maak een afspraak", en: "Book an Appointment" },
  step_service: { nl: "Behandeling", en: "Service" },
  step_datetime: { nl: "Datum & tijd", en: "Date & Time" },
  step_info: { nl: "Jouw gegevens", en: "Your Info" },
  step_confirm: { nl: "Bevestigen", en: "Confirm" },
  choose_services: { nl: "Kies je behandelingen", en: "Choose Services" },
  multi_hint_1: { nl: "Je kunt", en: "You can select" },
  multi_hint_2: { nl: "meerdere behandelingen", en: "multiple services" },
  multi_hint_3: { nl: "kiezen voor dezelfde afspraak.", en: "for the same appointment." },
  duration: { nl: "min", en: "min duration" },
  selected_count_1: { nl: "behandeling gekozen", en: "service selected" },
  selected_count_n: { nl: "behandelingen gekozen", en: "services selected" },
  total: { nl: "Totaal", en: "Total" },
  continue: { nl: "Verder →", en: "Continue →" },
  back: { nl: "← Terug", en: "← Back" },
  review: { nl: "Controleren →", en: "Review →" },
  pick_datetime: { nl: "Kies een datum en tijd", en: "Pick a Date & Time" },
  selected: { nl: "Gekozen", en: "Selected" },
  services_word: { nl: "behandelingen", en: "services" },
  loading_schedule: { nl: "Agenda laden…", en: "Loading schedule…" },
  date: { nl: "Datum", en: "Date" },
  time: { nl: "Tijd", en: "Time" },
  closed: { nl: "Dicht", en: "Closed" },
  no_slots: { nl: "Geen tijden meer vrij op deze dag.", en: "No slots available for this date." },
  your_details: { nl: "Jouw gegevens", en: "Your Details" },
  full_name: { nl: "Volledige naam", en: "Full Name" },
  name_placeholder: { nl: "bijv. Maria Lopes", en: "e.g. Maria Lopes" },
  phone_label: { nl: "Telefoon / WhatsApp", en: "Phone / WhatsApp" },
  note_label: { nl: "Opmerking voor de salon", en: "Note for the salon" },
  optional: { nl: "(optioneel)", en: "(optional)" },
  note_placeholder: { nl: "Allergieën, wensen, speciale verzoeken…", en: "Allergies, preferences, special requests…" },
  confirm_booking: { nl: "Afspraak bevestigen", en: "Confirm Booking" },
  booking: { nl: "Bezig met boeken…", en: "Booking…" },
  name: { nl: "Naam", en: "Name" },
  phone: { nl: "Telefoon", en: "Phone" },
  note: { nl: "Opmerking", en: "Note" },
  service_1: { nl: "Behandeling", en: "Service" },
  service_n: { nl: "Behandelingen", en: "Services" },
  err_required: { nl: "Vul alle verplichte velden in.", en: "Please fill in all required fields." },
  err_agenda: { nl: "De agenda kon niet geladen worden. Ververs de pagina.", en: "Could not load the agenda. Please refresh the page." },
  err_taken: { nl: "Sorry, deze tijd is net door iemand anders geboekt. Kies een andere tijd.", en: "Sorry, this time was just booked by someone else. Please choose another time." },
  err_generic: { nl: "Er ging iets mis. Probeer het opnieuw.", en: "Something went wrong. Please try again." },
  loading: { nl: "Laden…", en: "Loading…" },

  // Success page
  booked_title: { nl: "Je afspraak is aangevraagd!", en: "You're booked!" },
  booked_sub: { nl: "We hebben je aanvraag ontvangen. Shea bevestigt hem zo snel mogelijk, houd je WhatsApp of telefoon in de gaten.", en: "Your appointment request has been received. Shea will confirm it shortly — keep an eye on your WhatsApp or phone." },
  bank_transfer: { nl: "Overmaken", en: "Bank transfer" },
  account: { nl: "rekening", en: "account" },
  account_name: { nl: "Naam", en: "Name" },
  description: { nl: "Omschrijving", en: "Description" },
  need_change: { nl: "Iets wijzigen? WhatsApp", en: "Need to change something? WhatsApp" },
  back_home: { nl: "Terug naar home", en: "Back to Home" },
  view_all_services: { nl: "Alle behandelingen", en: "View All Services" },
} as const;

export type TKey = keyof typeof dict;

export function t(lang: Lang, key: TKey): string {
  return dict[key][lang] ?? dict[key].en;
}

/** Treatment categories from the database, shown in the visitor's language. */
const CATEGORY_NAMES: Record<string, Record<Lang, string>> = {
  Facials: { nl: "Gezichtsbehandelingen", en: "Facials" },
  "Mani / Pedi": { nl: "Manicure / Pedicure", en: "Mani / Pedi" },
  Waxing: { nl: "Harsen", en: "Waxing" },
  PMU: { nl: "Permanente make-up", en: "PMU" },
};

export function categoryName(lang: Lang, category: string): string {
  return CATEGORY_NAMES[category]?.[lang] ?? category;
}

/** Pick a language from an Accept-Language header (Dutch if it is listed, else English). */
export function langFromAcceptLanguage(header: string | null): Lang {
  if (!header) return DEFAULT_LANG;
  const first = header.toLowerCase();
  if (first.includes("nl")) return "nl";
  return "en";
}
