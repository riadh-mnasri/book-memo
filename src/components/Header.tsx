import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

export function Header() {
  const t = useTranslations("nav");
  const tApp = useTranslations("app");

  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-4 sm:gap-4 sm:px-5">
        <Link href="/" className="flex shrink-0 items-baseline gap-2">
          <span className="font-serif text-xl font-semibold tracking-tight text-foreground">
            {tApp("name")}
          </span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="hidden text-sm text-muted transition-colors hover:text-foreground sm:inline"
          >
            {t("catalog")}
          </Link>
          <Link
            href="/add"
            aria-label={t("addBook")}
            className="rounded-full bg-accent px-3 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 sm:px-4"
          >
            <span aria-hidden="true" className="sm:hidden">+</span>
            <span aria-hidden="true" className="hidden sm:inline">{t("addBook")}</span>
          </Link>
          <LocaleSwitcher />
        </nav>
      </div>
    </header>
  );
}
