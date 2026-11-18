export type TimelineItem = { time: string; text: string };

export type Settings = {
  groom: string;
  bride: string;
  wedding_date: string; // YYYY-MM-DD
  poruwa_time: string;
  lunch_time: string;
  reception_time: string;
  time_title: string; // heading of the Time card
  poruwa_label: string; // label under the Poruwa time
  lunch_label: string; // label under the lunch time
  reception_label: string; // label under the reception time
  // About card (floating "About" popup)
  about_by: string;
  about_brand: string;
  about_tagline: string; // one line per row
  about_whatsapp: string; // digits only
  about_web_url: string;
  about_web_text: string;
  invitation_message: string;
  venue_name: string;
  venue_address: string;
  map_query: string;
  map_link: string; // optional custom Google Maps link
  timeline: TimelineItem[];
  details_lines: string[];
  rsvp_deadline: string;
  rsvp_phone: string;
  whatsapp_number: string;
  gallery: string[]; // up to 4 base64 data-URL photos (auto-compressed)
  // Standard Sinhala wedding invitation format (family columns)
  family_title: string;
  bride_lines: string[]; // e.g. village, father, mother, "ආදරණිය දියණිය"
  bride_family_name: string; // highlighted name of the bride
  groom_lines: string[];
  groom_family_name: string;
  hidden_sections: string[]; // section ids the admin chose to hide
};

export const SETTINGS_KEYS: (keyof Settings)[] = [
  "groom",
  "bride",
  "wedding_date",
  "poruwa_time",
  "lunch_time",
  "reception_time",
  "time_title",
  "poruwa_label",
  "lunch_label",
  "reception_label",
  "about_by",
  "about_brand",
  "about_tagline",
  "about_whatsapp",
  "about_web_url",
  "about_web_text",
  "invitation_message",
  "venue_name",
  "venue_address",
  "map_query",
  "map_link",
  "timeline",
  "details_lines",
  "rsvp_deadline",
  "rsvp_phone",
  "whatsapp_number",
  "gallery",
  "family_title",
  "bride_lines",
  "bride_family_name",
  "groom_lines",
  "groom_family_name",
  "hidden_sections",
];

const ARRAY_KEYS: (keyof Settings)[] = [
  "timeline",
  "details_lines",
  "bride_lines",
  "groom_lines",
  "hidden_sections",
  "gallery",
];

/** Sections that can be toggled on/off from the admin dashboard. */
export const SECTIONS: { id: string; label: string }[] = [
  { id: "family", label: "Family Details" },
  { id: "calendar", label: "Calendar & Countdown" },
  { id: "time", label: "Times" },
  { id: "venue", label: "Venue & Map" },
  { id: "timeline", label: "Poruwa Timeline" },
  { id: "gallery", label: "Photo Gallery" },
  { id: "details", label: "Details" },
];

export const DEFAULT_SETTINGS: Settings = {
  groom: "Sandun",
  bride: "Nimesha",
  wedding_date: "2027-03-06",
  poruwa_time: "9:12 AM",
  lunch_time: "12:30 PM",
  reception_time: "6:30 PM",
  time_title: "Time",
  poruwa_label: "Poruwa Ceremony",
  lunch_label: "Wedding Lunch",
  reception_label: "Evening Reception",
  about_by: "Design By",
  about_brand: "JGS Lanka Co.",
  about_tagline: "Beautiful wedding invitations,\ncrafted with love.",
  about_whatsapp: "94702001859",
  about_web_url: "https://www.jgslanka.com",
  about_web_text: "www.jgslanka.com",
  invitation_message:
    "request the honour of your presence as they unite in marriage. Join us in celebrating the beginning of a lifetime of love, laughter and togetherness.",
  venue_name: "Grand Orchid Ballroom",
  venue_address: "Colombo, Sri Lanka",
  map_query: "Colombo Sri Lanka",
  map_link: "",
  timeline: [
    { time: "9:00 AM", text: "Grand procession of the couple to the Poruwa" },
    { time: "9:12 AM", text: "Ashtaka & Jayamangala Gatha blessings" },
    { time: "9:25 AM", text: "Lighting of the oil lamp & binding of hands with gold thread, with the pouring of water" },
    { time: "9:40 AM", text: "Exchange of rings & ceremonial gifts" },
    { time: "10:00 AM", text: "Sharing of kiribath & blessings of the elders" },
  ],
  details_lines: [
    "Dress code: Traditional / White & Gold",
    "Complimentary parking is available at the venue",
    "Gifts: Your presence is the greatest gift of all",
    "Kindly be seated by 9:00 AM for the Poruwa ceremony",
    "Kindly RSVP by 1st February",
  ],
  rsvp_deadline: "1st February",
  rsvp_phone: "+94771234567",
  whatsapp_number: "94771234567",
  gallery: [],
  family_title: "මෙන්න සුභ මංගල්ලේ..",
  bride_lines: [
    "කුලවල ගමේ දී පදිංචි",
    "ගෙ. එස්. සී නවරත්න කුමාර මහතාගේ",
    "නා චිත්‍රා වීරක්කොඩියාගේ",
    "ආදරණිය දියණිය",
  ],
  bride_family_name: "කුමාරි නිම්මහා",
  groom_lines: [
    "කැන්දගම ගමේ දී පදිංචි",
    "ආර්. එමි නන්ද චන්ද්‍රසිරි මහතාගේ",
    "නා චිත්‍රා වීරක්කොඩියාගේ",
    "ආදරණිය පුත්",
  ],
  groom_family_name: "ලක්මාල්",
  hidden_sections: [],
};

function str(v: unknown, fallback: string): string {
  return typeof v === "string" && v.length > 0 ? v : fallback;
}

function parseArray(v: unknown, fallback: string[]): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x));
  if (typeof v === "string" && v.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(v);
      if (Array.isArray(parsed)) return parsed.map((x) => String(x));
    } catch {
      /* fall through */
    }
  }
  return fallback;
}

function parseTimeline(v: unknown, fallback: TimelineItem[]): TimelineItem[] {
  let arr: unknown[] = [];
  if (Array.isArray(v)) arr = v;
  else if (typeof v === "string" && v.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(v);
      if (Array.isArray(parsed)) arr = parsed;
    } catch {
      /* fall through */
    }
  }
  const items = arr
    .map((it) => {
      if (it && typeof it === "object") {
        const o = it as Record<string, unknown>;
        return { time: str(o.time, ""), text: str(o.text, "") };
      }
      return { time: "", text: String(it) };
    })
    .filter((it) => it.text.length > 0);
  return items.length ? items : fallback;
}

/** Keys where an empty string is a valid value (so the admin can clear them). */
const EMPTY_OK: (keyof Settings)[] = [
  "time_title",
  "poruwa_label",
  "lunch_label",
  "reception_label",
  "about_by",
  "about_brand",
  "about_tagline",
  "about_whatsapp",
  "about_web_url",
  "about_web_text",
];

/** Merge a raw key/value map (from D1 or admin input) into a validated Settings object. */
export function normalizeSettings(map: Record<string, unknown>): Settings {
  const out = { ...DEFAULT_SETTINGS };
  for (const key of SETTINGS_KEYS) {
    const raw = map[key];
    if (key === "timeline") out.timeline = parseTimeline(raw, DEFAULT_SETTINGS.timeline);
    else if (ARRAY_KEYS.includes(key)) out[key] = parseArray(raw, DEFAULT_SETTINGS[key] as string[]) as never;
    else if (EMPTY_OK.includes(key))
      out[key] = (typeof raw === "string" ? raw : DEFAULT_SETTINGS[key]) as never;
    else out[key] = str(raw, DEFAULT_SETTINGS[key] as string) as never;
  }
  return out;
}

/** Serialize Settings into flat key/value rows for D1 storage. */
export function toRecord(s: Settings): Record<string, string> {
  const rec: Record<string, string> = {};
  for (const key of SETTINGS_KEYS) {
    const v = s[key];
    rec[key] = ARRAY_KEYS.includes(key) ? JSON.stringify(v) : String(v);
  }
  return rec;
}
