import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-6 text-center text-sm text-muted">
      {t("copyright", { year })}
    </footer>
  );
}
