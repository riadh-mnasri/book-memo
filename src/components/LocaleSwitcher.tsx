"use client";

import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();

  return (
    <label className="flex items-center gap-2 text-sm text-muted">
      <span className="sr-only">{t("language")}</span>
      <select
        value={locale}
        onChange={(event) => router.replace(pathname, { locale: event.target.value })}
        className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
      >
        {routing.locales.map((loc) => (
          <option key={loc} value={loc}>
            {loc.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
