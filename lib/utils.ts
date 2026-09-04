import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/**
 * Render a number in Eastern Arabic numerals, zero-padded to two places.
 * Index marks read as part of the Arabic setting rather than as Latin
 * intrusions into it.
 */
export function arabicIndex(value: string | number): string {
  const n = typeof value === "number" ? value : parseInt(value, 10);
  if (Number.isNaN(n)) return String(value);

  return String(n)
    .padStart(2, "0")
    .replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)]);
}
