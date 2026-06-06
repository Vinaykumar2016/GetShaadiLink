export interface WeddingEvent {
  name: string;
  regional: string;
  time: string;
  emoji: string;
  venue?: string;
  note?: string;
}

export interface WeddingTheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  heroEmoji: string;
}

export interface Invitation {
  slug: string;
  bride: string;
  groom: string;
  niceDate: string;
  city: string;
  vname: string;
  vaddr: string;
  storyEnglish: string;
  storyRegional: string;
  tagline: string;
  lang: string;
  langNative: string;
  events: WeddingEvent[];
  shagunOn: boolean;
  upiId: string;
  dateRaw: string;
  photos: string[]; // Base64 data strings
  theme: WeddingTheme;
  postWeddingPhotosUrl?: string;
  editPassword?: string;
  groomParents?: string;
  brideParents?: string;
  familyBlessings?: string;
  guestbookNotes?: Array<{ id: string; name: string; note: string; date: string; amount?: string }>;
  createdAt?: string;
  ownerEmail?: string;
  views?: number;
  openingTheme?: "elephant" | "thread" | "diya" | "lotus" | "jaipur" | "garland";
}

