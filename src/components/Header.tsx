import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

export function Header() {
  const t = useTranslations("nav");
  const tApp = useTranslations("app");

  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-xl font-semibold tracking-tight text-foreground">
            {tApp("name")}
          </span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden text-sm text-muted transition-colors hover:text-foreground sm:inline"
          >
            {t("catalog")}
          </Link>
          <Link
            href="/add"
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            {t("addBook")}
          </Link>
          <LocaleSwitcher />
        </nav>
      </div>
    </header>
  );
}
