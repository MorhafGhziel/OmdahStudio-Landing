import type { ObjectId } from "mongodb";

export interface ServiceType {
  _id?: ObjectId | string;
  id: string;
  title: string;
  category: string;
  description: string;
  features: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WorkType {
  _id?: string;
  id?: string;
  title: string;
  category: string;
  client: string;
  year: string;
  description?: string;
  image?: string;
  video?: string;
  video2?: string;
  featured?: boolean;
  services?: string[];
  link?: string;
}

export interface ClientType {
  _id: string;
  name: string;
  logo: string;
}

/* ---- Editable copy, stored per-section in the `content` collection ---- */

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
