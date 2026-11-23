import { supabase } from "@/lib/supabase";
import type { Lang } from "@/lib/i18n";

// Everything Shea can change herself in Admin → Website.
// The values below are the defaults; whatever she saves is stored in the
// `site_content` table and wins over these.

export type FieldType = "text" | "textarea" | "image";

export interface ContentField {
  key: string;
  label: string;
  type: FieldType;
  default: string;
  help?: string;
}

export interface ContentGroup {
  title: string;
  fields: ContentField[];
}

export const CONTENT_GROUPS: ContentGroup[] = [
  {
    title: "Top of the home page",
    fields: [
      { key: "hero_eyebrow", label: "Small line above the title", type: "text", default: "Aim & More Studio · Suriname" },
      { key: "hero_title_1", label: "Title – first line", type: "text", default: "Because you deserve" },
      { key: "hero_title_highlight", label: "Title – pink italic line", type: "text", default: "good brows & sexy lips," },
      { key: "hero_title_2", label: "Title – last line", type: "text", default: "every day." },
      { key: "hero_sub", label: "Line under the title", type: "text", default: "Premium nails · pedicures · waxing · permanent make-up" },
      { key: "hero_image", label: "Big photo", type: "image", default: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80" },
      { key: "hero_badge_num", label: "Badge number (leave empty to hide)", type: "text", default: "" },
      { key: "hero_badge_label", label: "Badge text", type: "text", default: "Happy clients" },
    ],
  },
  {
    title: "The Studio",
    fields: [
      { key: "about_title_1", label: "Title – first line", type: "text", default: "Where confidence" },
      { key: "about_title_2", label: "Title – second line", type: "text", default: "is crafted." },
      {
        key: "about_para_1", label: "First paragraph", type: "textarea",
        default: "Aim & More is a boutique beauty studio in Suriname offering a curated menu of nail care, waxing, facials, and permanent make-up. Every treatment is performed with precision, care, and an eye for detail — because you deserve to feel extraordinary.",
      },
      {
        key: "about_para_2", label: "Second paragraph", type: "textarea",
        default: "Our signature Ombre Powder Brows and Lipblush PMU treatments are fully inclusive of the follow-up touch-up, ensuring your results last beautifully.",
      },
      { key: "about_image", label: "Photo", type: "image", default: "/images/shea.jpg" },
    ],
  },
  {
    title: "Signature treatments (4 cards, empty name = hidden)",
    fields: [
      { key: "feat1_name", label: "Card 1 – name", type: "text", default: "Ombre Powder Brows" },
      { key: "feat1_category", label: "Card 1 – category", type: "text", default: "PMU" },
      { key: "feat1_price", label: "Card 1 – price (SRD)", type: "text", default: "2500" },
      { key: "feat1_tag", label: "Card 1 – small note", type: "text", default: "Incl. touch-up" },
      { key: "feat1_image", label: "Card 1 – photo", type: "image", default: "https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?w=400&q=80" },
      { key: "feat2_name", label: "Card 2 – name", type: "text", default: "Russian Pedicure" },
      { key: "feat2_category", label: "Card 2 – category", type: "text", default: "Mani / Pedi" },
      { key: "feat2_price", label: "Card 2 – price (SRD)", type: "text", default: "550" },
      { key: "feat2_tag", label: "Card 2 – small note", type: "text", default: "" },
      { key: "feat2_image", label: "Card 2 – photo", type: "image", default: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&q=80" },
      { key: "feat3_name", label: "Card 3 – name", type: "text", default: "Brazilian Wax" },
      { key: "feat3_category", label: "Card 3 – category", type: "text", default: "Waxing" },
      { key: "feat3_price", label: "Card 3 – price (SRD)", type: "text", default: "550" },
      { key: "feat3_tag", label: "Card 3 – small note", type: "text", default: "" },
      { key: "feat3_image", label: "Card 3 – photo", type: "image", default: "" },
      { key: "feat4_name", label: "Card 4 – name", type: "text", default: "Dermaplaning" },
      { key: "feat4_category", label: "Card 4 – category", type: "text", default: "Facials" },
      { key: "feat4_price", label: "Card 4 – price (SRD)", type: "text", default: "975" },
      { key: "feat4_tag", label: "Card 4 – small note", type: "text", default: "" },
      { key: "feat4_image", label: "Card 4 – photo", type: "image", default: "https://images.unsplash.com/photo-1570172619644-def2d4e680a6?w=400&q=80" },
    ],
  },
  {
    title: "Photo gallery (empty = hidden)",
    fields: [
      { key: "gallery_1", label: "Photo 1", type: "image", default: "/images/before-after-hair.jpg" },
      { key: "gallery_2", label: "Photo 2", type: "image", default: "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=500&q=80" },
      { key: "gallery_3", label: "Photo 3", type: "image", default: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=80" },
      { key: "gallery_4", label: "Photo 4", type: "image", default: "https://images.unsplash.com/photo-1588514727390-91fd5ebaef81?w=500&q=80" },
      { key: "gallery_5", label: "Photo 5", type: "image", default: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c1?w=500&q=80" },
      { key: "gallery_6", label: "Photo 6", type: "image", default: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80" },
      { key: "gallery_7", label: "Photo 7", type: "image", default: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=80" },
    ],
  },
  {
    title: "Client reviews (only real ones! empty quote = hidden)",
    fields: [
      { key: "review1_quote", label: "Review 1 – text", type: "textarea", default: "" },
      { key: "review1_name", label: "Review 1 – name", type: "text", default: "" },
      { key: "review1_service", label: "Review 1 – treatment", type: "text", default: "" },
      { key: "review2_quote", label: "Review 2 – text", type: "textarea", default: "" },
      { key: "review2_name", label: "Review 2 – name", type: "text", default: "" },
      { key: "review2_service", label: "Review 2 – treatment", type: "text", default: "" },
      { key: "review3_quote", label: "Review 3 – text", type: "textarea", default: "" },
      { key: "review3_name", label: "Review 3 – name", type: "text", default: "" },
      { key: "review3_service", label: "Review 3 – treatment", type: "text", default: "" },
    ],
  },
  {
    title: "Bottom banner",
    fields: [
      { key: "cta_title", label: "Title", type: "text", default: "Ready to glow?" },
      { key: "cta_sub", label: "Text", type: "text", default: "Book your appointment online — it only takes a minute." },
    ],
  },
];

// Dutch versions of the default texts. Shea's Dutch texts are saved as "<key>__nl".
const NL_DEFAULTS: Record<string, string> = {
  hero_eyebrow: "Aim & More Studio · Suriname",
  hero_title_1: "Omdat je het verdient:",
  hero_title_highlight: "mooie wenkbrauwen & sexy lippen,",
  hero_title_2: "elke dag.",
  hero_sub: "Nagels · pedicure · harsen · permanente make-up",
  hero_badge_label: "Blije klanten",
  about_title_1: "Waar zelfvertrouwen",
  about_title_2: "gemaakt wordt.",
  about_para_1: "Aim & More is een boutique beautystudio in Suriname met een zorgvuldig gekozen aanbod: nagelverzorging, harsen, gezichtsbehandelingen en permanente make-up. Elke behandeling doen we met precisie, zorg en oog voor detail, want jij verdient het om je bijzonder te voelen.",
  about_para_2: "Onze signature Ombre Powder Brows en Lipblush (PMU) zijn inclusief de touch-up, zodat je resultaat mooi blijft.",
  feat1_category: "Permanente make-up",
  feat1_tag: "Incl. touch-up",
  feat2_category: "Manicure / Pedicure",
  feat3_name: "Brazilian harsen",
  feat3_category: "Harsen",
  feat4_category: "Gezichtsbehandeling",
  cta_title: "Klaar om te stralen?",
  cta_sub: "Boek je afspraak online, het duurt maar een minuut.",
};

/** Text fields have one value per language; photos are shared. */
export const TRANSLATED_TYPES: FieldType[] = ["text", "textarea"];
export const langKey = (key: string, lang: Lang) => (lang === "en" ? key : `${key}__${lang}`);

export type SiteContent = Record<string, string>;

export const DEFAULT_CONTENT: SiteContent = Object.fromEntries(
  CONTENT_GROUPS.flatMap((g) =>
    g.fields.flatMap((f) =>
      TRANSLATED_TYPES.includes(f.type)
        ? [[f.key, f.default], [langKey(f.key, "nl"), NL_DEFAULTS[f.key] ?? f.default]]
        : [[f.key, f.default]]
    )
  )
);

/** All saved rows merged over the defaults (every language). Never throws. */
export async function getAllSiteContent(): Promise<SiteContent> {
  try {
    const { data, error } = await supabase.from("site_content").select("key, value");
    if (error || !data) return { ...DEFAULT_CONTENT };
    const saved = Object.fromEntries(
      (data as { key: string; value: string | null }[]).map((r) => [r.key, r.value ?? ""])
    );
    return { ...DEFAULT_CONTENT, ...saved };
  } catch {
    return { ...DEFAULT_CONTENT };
  }
}

/** The content for one language, keyed by the plain field key. */
export async function getSiteContent(lang: Lang): Promise<SiteContent> {
  const all = await getAllSiteContent();
  const out: SiteContent = {};
  for (const g of CONTENT_GROUPS) {
    for (const f of g.fields) {
      // An empty translation falls back to the English text
      out[f.key] = TRANSLATED_TYPES.includes(f.type) ? all[langKey(f.key, lang)] || all[f.key] : all[f.key];
    }
  }
  return out;
}
