import { useTranslations } from "next-intl";
import { isKnownThemeKey } from "@/lib/theme-labels";

export function ThemeTag({ theme, className = "" }: { theme: string; className?: string }) {
  const t = useTranslations("themes");
  const label = isKnownThemeKey(theme) ? t(theme) : theme;

  return (
    <span
      className={`inline-flex items-center rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-muted ${className}`}
    >
      {label}
    </span>
  );
}
