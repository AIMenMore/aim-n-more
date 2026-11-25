// Website languages. Add a language by adding it to LANGS and giving every key a text.
export const LANGS = ["nl", "en", "es"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "nl";
export const LANG_COOKIE = "lang";
export const LANG_LABELS: Record<Lang, string> = { nl: "NL", en: "EN", es: "ES" };
export const LOCALES: Record<Lang, string> = { nl: "nl-NL", en: "en-US", es: "es-ES" };

export function isLang(v: unknown): v is Lang {
  return typeof v === "string" && (LANGS as readonly string[]).includes(v);
}

const dict = {
  // Navigation & footer
  nav_home: { nl: "Home", en: "Home" , es: "Inicio" },
  nav_services: { nl: "Behandelingen", en: "Services" , es: "Servicios" },
  nav_book: { nl: "Boek nu", en: "Book Now" , es: "Reservar" },
  lang_label: { nl: "Taal", en: "Language" , es: "Idioma" },
  footer_tagline: { nl: "Omdat je mooie wenkbrauwen en sexy lippen verdient, elke dag.", en: "Because you deserve good brows and sexy lips, every day." , es: "Porque mereces unas cejas bonitas y unos labios sexys, cada día." },
  footer_hours: { nl: "Openingstijden", en: "Hours" , es: "Horario" },
  footer_contact: { nl: "Contact", en: "Contact" , es: "Contacto" },
  footer_follow: { nl: "Volg ons", en: "Follow" , es: "Síguenos" },
  footer_email: { nl: "Mail ons", en: "Email us" , es: "Escríbenos" },
  footer_rights: { nl: "Alle rechten voorbehouden.", en: "All rights reserved." , es: "Todos los derechos reservados." },

  // Business details
  hours_days: { nl: "Ma – Za", en: "Mon – Sat" , es: "Lun – Sáb" },
  hours_closed: { nl: "Zondag gesloten", en: "Sunday closed" , es: "Domingo cerrado" },
  address_line2: { nl: "Hoek Livorno 4e Dwarsstraat", en: "Corner of Livorno 4e Dwarsstraat" , es: "Esquina Livorno 4e Dwarsstraat" },
  home_service_note: { nl: "Massages aan huis mogelijk vanaf 2 personen.", en: "Home-service massages available for 2 or more people." , es: "Masajes a domicilio disponibles a partir de 2 personas." },
  policy_late: { nl: "10 minuten of meer te laat: SRD 50 boete.", en: "Arriving 10 minutes late or more: SRD 50 late fee." , es: "10 minutos o más de retraso: multa de SRD 50." },
  policy_cancelled: { nl: "30 minuten te laat: de afspraak vervalt.", en: "30 minutes late: the appointment is cancelled." , es: "30 minutos de retraso: la cita se cancela." },
  policy_notice: { nl: "Afzeggen of verzetten graag minstens 24 uur van tevoren.", en: "Please cancel or reschedule at least 24 hours in advance." , es: "Por favor cancela o cambia tu cita con al menos 24 horas de antelación." },
  payment_methods: { nl: "Contant, overmaking of Uni5Pay+", en: "Cash, bank transfer or Uni5Pay+" , es: "Efectivo, transferencia bancaria o Uni5Pay+" },
  payment_reference: { nl: "Aimenmore + behandeling (bijv. “aimenmore brazilian”)", en: "Aimenmore + treatment (e.g. “aimenmore brazilian”)" , es: "Aimenmore + tratamiento (p. ej. “aimenmore brazilian”)" },

  // Home page (fixed labels)
  home_book: { nl: "Maak een afspraak", en: "Book an Appointment" , es: "Reservar una cita" },
  home_view_services: { nl: "Bekijk behandelingen", en: "View Services" , es: "Ver servicios" },
  intro_open: { nl: "Open voor afspraken", en: "Open for appointments" , es: "Abierto para citas" },
  intro_hours: { nl: "Openingstijden", en: "Working hours" , es: "Horario de atención" },
  intro_call: { nl: "Bel of WhatsApp", en: "Call or WhatsApp" , es: "Llama o WhatsApp" },
  studio_label: { nl: "De studio", en: "The Studio" , es: "El estudio" },
  explore_services: { nl: "Alle behandelingen", en: "Explore All Services" , es: "Todos los servicios" },
  featured_label: { nl: "Signature behandelingen", en: "Signature Treatments" , es: "Tratamientos estrella" },
  featured_title: { nl: "Onze specialiteiten", en: "Our specialties" , es: "Nuestras especialidades" },
  view_all: { nl: "Bekijk alles →", en: "View all →" , es: "Ver todo →" },
  book_now: { nl: "Boek nu", en: "Book Now" , es: "Reservar" },
  gallery_label: { nl: "Rechtstreeks uit de studio", en: "Straight From The Studio" , es: "Directo del estudio" },
  gallery_title: { nl: "Het resultaat spreekt", en: "The results speak" , es: "Los resultados hablan" },
  gallery_more: { nl: "Meer op Instagram →", en: "See more on Instagram →" , es: "Más en Instagram →" },
  reviews_label: { nl: "Klantverhalen", en: "Client Stories" , es: "Opiniones de clientas" },
  reviews_title: { nl: "Vertrouwd door onze vaste klanten", en: "Trusted by our regulars" , es: "La confianza de nuestras clientas" },
  good_to_know: { nl: "Goed om te weten", en: "Good to know" , es: "Bueno saber" },
  payment: { nl: "Betalen", en: "Payment" , es: "Pago" },
  find_us: { nl: "Hier vind je ons", en: "Find Us" , es: "Dónde estamos" },
  location: { nl: "Locatie", en: "Location" , es: "Ubicación" },
  phone_whatsapp: { nl: "Telefoon / WhatsApp", en: "Phone / WhatsApp" , es: "Teléfono / WhatsApp" },
  socials: { nl: "Socials", en: "Socials" , es: "Redes sociales" },

  // Services page
  services_eyebrow: { nl: "Wat we doen", en: "What we offer" , es: "Lo que ofrecemos" },
  services_title: { nl: "Onze behandelingen", en: "Our Services" , es: "Nuestros servicios" },
  services_prices: { nl: "Alle prijzen in Surinaamse dollars (SRD). Boek online of bel", en: "All prices in Surinamese dollars (SRD). Book online or call" , es: "Todos los precios en dólares surinameses (SRD). Reserva en línea o llama al" },
  services_empty: { nl: "Er zijn op dit moment geen behandelingen beschikbaar.", en: "No services available at this time." , es: "No hay servicios disponibles en este momento." },
  services_cta: { nl: "Zin om jezelf te verwennen?", en: "Ready to treat yourself?" , es: "¿Lista para consentirte?" },

  // Booking
  book_eyebrow: { nl: "Online boeken", en: "Online booking" , es: "Reserva en línea" },
  book_title: { nl: "Maak een afspraak", en: "Book an Appointment" , es: "Reservar una cita" },
  step_service: { nl: "Behandeling", en: "Service" , es: "Servicio" },
  step_datetime: { nl: "Datum & tijd", en: "Date & Time" , es: "Fecha y hora" },
  step_info: { nl: "Jouw gegevens", en: "Your Info" , es: "Tus datos" },
  step_confirm: { nl: "Bevestigen", en: "Confirm" , es: "Confirmar" },
  choose_services: { nl: "Kies je behandelingen", en: "Choose Services" , es: "Elige tus servicios" },
  multi_hint_1: { nl: "Je kunt", en: "You can select" , es: "Puedes elegir" },
  multi_hint_2: { nl: "meerdere behandelingen", en: "multiple services" , es: "varios servicios" },
  multi_hint_3: { nl: "kiezen voor dezelfde afspraak.", en: "for the same appointment." , es: "para la misma cita." },
  duration: { nl: "min", en: "min duration" , es: "min" },
  selected_count_1: { nl: "behandeling gekozen", en: "service selected" , es: "servicio elegido" },
  selected_count_n: { nl: "behandelingen gekozen", en: "services selected" , es: "servicios elegidos" },
  total: { nl: "Totaal", en: "Total" , es: "Total" },
  continue: { nl: "Verder →", en: "Continue →" , es: "Continuar →" },
  back: { nl: "← Terug", en: "← Back" , es: "← Atrás" },
  review: { nl: "Controleren →", en: "Review →" , es: "Revisar →" },
  pick_datetime: { nl: "Kies een datum en tijd", en: "Pick a Date & Time" , es: "Elige fecha y hora" },
  selected: { nl: "Gekozen", en: "Selected" , es: "Elegido" },
  services_word: { nl: "behandelingen", en: "services" , es: "servicios" },
  loading_schedule: { nl: "Agenda laden…", en: "Loading schedule…" , es: "Cargando agenda…" },
  date: { nl: "Datum", en: "Date" , es: "Fecha" },
  time: { nl: "Tijd", en: "Time" , es: "Hora" },
  closed: { nl: "Dicht", en: "Closed" , es: "Cerrado" },
  no_slots: { nl: "Geen tijden meer vrij op deze dag.", en: "No slots available for this date." , es: "No quedan horas libres este día." },
  your_details: { nl: "Jouw gegevens", en: "Your Details" , es: "Tus datos" },
  full_name: { nl: "Volledige naam", en: "Full Name" , es: "Nombre completo" },
  name_placeholder: { nl: "bijv. Maria Lopes", en: "e.g. Maria Lopes" , es: "p. ej. Maria Lopes" },
  phone_label: { nl: "Telefoon / WhatsApp", en: "Phone / WhatsApp" , es: "Teléfono / WhatsApp" },
  note_label: { nl: "Opmerking voor de salon", en: "Note for the salon" , es: "Nota para el salón" },
  optional: { nl: "(optioneel)", en: "(optional)" , es: "(opcional)" },
  note_placeholder: { nl: "Allergieën, wensen, speciale verzoeken…", en: "Allergies, preferences, special requests…" , es: "Alergias, preferencias, peticiones especiales…" },
  confirm_booking: { nl: "Afspraak bevestigen", en: "Confirm Booking" , es: "Confirmar cita" },
  booking: { nl: "Bezig met boeken…", en: "Booking…" , es: "Reservando…" },
  name: { nl: "Naam", en: "Name" , es: "Nombre" },
  phone: { nl: "Telefoon", en: "Phone" , es: "Teléfono" },
  note: { nl: "Opmerking", en: "Note" , es: "Nota" },
  service_1: { nl: "Behandeling", en: "Service" , es: "Servicio" },
  service_n: { nl: "Behandelingen", en: "Services" , es: "Servicios" },
  err_required: { nl: "Vul alle verplichte velden in.", en: "Please fill in all required fields." , es: "Completa todos los campos obligatorios." },
  err_agenda: { nl: "De agenda kon niet geladen worden. Ververs de pagina.", en: "Could not load the agenda. Please refresh the page." , es: "No se pudo cargar la agenda. Actualiza la página." },
  err_taken: { nl: "Sorry, deze tijd is net door iemand anders geboekt. Kies een andere tijd.", en: "Sorry, this time was just booked by someone else. Please choose another time." , es: "Lo sentimos, alguien acaba de reservar esta hora. Elige otra hora." },
  err_generic: { nl: "Er ging iets mis. Probeer het opnieuw.", en: "Something went wrong. Please try again." , es: "Algo salió mal. Inténtalo de nuevo." },
  loading: { nl: "Laden…", en: "Loading…" , es: "Cargando…" },

  // Success page
  booked_title: { nl: "Je afspraak is aangevraagd!", en: "You're booked!" , es: "¡Tu cita está solicitada!" },
  booked_sub: { nl: "We hebben je aanvraag ontvangen. Shea bevestigt hem zo snel mogelijk, houd je WhatsApp of telefoon in de gaten.", en: "Your appointment request has been received. Shea will confirm it shortly — keep an eye on your WhatsApp or phone." , es: "Hemos recibido tu solicitud. Shea la confirmará lo antes posible, mantén un ojo en tu WhatsApp o teléfono." },
  bank_transfer: { nl: "Overmaken", en: "Bank transfer" , es: "Transferencia" },
  account: { nl: "rekening", en: "account" , es: "cuenta" },
  account_name: { nl: "Naam", en: "Name" , es: "Nombre" },
  description: { nl: "Omschrijving", en: "Description" , es: "Descripción" },
  need_change: { nl: "Iets wijzigen? WhatsApp", en: "Need to change something? WhatsApp" , es: "¿Necesitas cambiar algo? WhatsApp" },
  back_home: { nl: "Terug naar home", en: "Back to Home" , es: "Volver al inicio" },
  view_all_services: { nl: "Alle behandelingen", en: "View All Services" , es: "Todos los servicios" },
} as const;

export type TKey = keyof typeof dict;

export function t(lang: Lang, key: TKey): string {
  return dict[key][lang] ?? dict[key].en;
}

/** Treatment categories from the database, shown in the visitor's language. */
const CATEGORY_NAMES: Record<string, Record<Lang, string>> = {
  Facials: { nl: "Gezichtsbehandelingen", en: "Facials", es: "Tratamientos faciales" },
  "Mani / Pedi": { nl: "Manicure / Pedicure", en: "Mani / Pedi", es: "Manicura / Pedicura" },
  Waxing: { nl: "Harsen", en: "Waxing", es: "Depilación con cera" },
  PMU: { nl: "Permanente make-up", en: "PMU", es: "Maquillaje permanente" },
};

export function categoryName(lang: Lang, category: string): string {
  return CATEGORY_NAMES[category]?.[lang] ?? category;
}

/** Pick a language from an Accept-Language header: the first of Dutch/Spanish listed, else English. */
export function langFromAcceptLanguage(header: string | null): Lang {
  if (!header) return DEFAULT_LANG;
  const prefs = header.toLowerCase().split(",").map((p) => p.trim().slice(0, 2));
  for (const p of prefs) {
    if (p === "nl") return "nl";
    if (p === "es") return "es";
    if (p === "en") return "en";
  }
  return "en";
}
