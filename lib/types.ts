export interface WorkType {
  id: string;
  slug: string;
  /** Derived from the slug by the API so callers never build it themselves. */
  link: string;
  title: string;
  category: string;
  client: string;
  year: string;
  description: string;
  image: string | null;
  /** Object name in the `videos` bucket, e.g. "jedeal.mp4". */
  video: string | null;
  video2: string | null;
  featured: boolean;
  services: string[];
  position: number;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceType {
  id: string;
  title: string;
  category: string;
  description: string;
  features: string[];
  position: number;
  created_at?: string;
  updated_at?: string;
}

export interface ClientType {
  id: string;
  name: string;
  logo: string;
  position: number;
  created_at?: string;
  updated_at?: string;
}

/** A row of `allowed_emails` — who may sign in to the admin. */
export interface AllowedEmail {
  email: string;
  created_at?: string;
}

/* ---- Editable copy, one row per section in `site_content` ---- */

export interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  storyTitle: string;
}

export interface ServicesContent {
  badge: string;
  title: string;
  description: string;
  ctaText: string;
}

export interface ClientsContent {
  title: string;
  description: string;
}

export interface FooterContent {
  tagline: string;
  contactHeading: string;
  whatsappUrl: string;
  instagramUrl: string;
  email: string;
}
