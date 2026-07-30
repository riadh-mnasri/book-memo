import { THEME_KEYS } from "@/types/book";

export function isKnownThemeKey(value: string): value is (typeof THEME_KEYS)[number] {
  return (THEME_KEYS as readonly string[]).includes(value);
}
