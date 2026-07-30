"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useBooks } from "@/hooks/useBooks";
import { BookCard } from "@/components/BookCard";
import { SuggestedBooks } from "@/components/SuggestedBooks";
import { THEME_KEYS } from "@/types/book";
import type { ReadingStatus } from "@/types/book";

export default function CatalogPage() {
  const t = useTranslations("catalog");
  const tThemes = useTranslations("themes");
  const tStatus = useTranslations("status");
  const { books, isLoaded } = useBooks();
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState("");
  const [status, setStatus] = useState<ReadingStatus | "">("");

  const availableThemes = useMemo(() => {
    const custom = new Set<string>();
    books.forEach((book) => book.themes.forEach((th) => custom.add(th)));
    THEME_KEYS.forEach((key) => custom.add(key));
    return Array.from(custom);
  }, [books]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((book) => {
      if (theme && !book.themes.includes(theme)) return false;
      if (status && book.status !== status) return false;
      if (!q) return true;
      const haystack = [
        book.title,
        book.author,
        ...book.keyIdeas,
        ...book.takeaways,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [books, query, theme, status]);

  if (!isLoaded) return null;

  if (books.length === 0) {
    return (
      <div className="flex flex-col gap-10">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-16 text-center">
          <h1 className="font-serif text-2xl font-semibold">{t("emptyTitle")}</h1>
          <p className="max-w-sm text-muted">{t("emptyBody")}</p>
          <Link
            href="/add"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            {t("emptyCta")}
          </Link>
        </div>
        <SuggestedBooks existingTitles={[]} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("searchPlaceholder")}
          className="flex-1 rounded-full border border-border bg-surface px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
        />
        <select
          value={theme}
          onChange={(event) => setTheme(event.target.value)}
          className="rounded-full border border-border bg-surface px-4 py-2.5 text-sm"
        >
          <option value="">{t("allThemes")}</option>
          {availableThemes.map((key) => (
            <option key={key} value={key}>
              {(THEME_KEYS as readonly string[]).includes(key)
                ? tThemes(key as (typeof THEME_KEYS)[number])
                : key}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as ReadingStatus | "")}
          className="rounded-full border border-border bg-surface px-4 py-2.5 text-sm"
        >
          <option value="">{t("allStatuses")}</option>
          <option value="to-read">{tStatus("toRead")}</option>
          <option value="reading">{tStatus("reading")}</option>
          <option value="read">{tStatus("read")}</option>
        </select>
      </div>

      <p className="text-sm text-muted">{t("bookCount", { count: filtered.length })}</p>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-muted">{t("noResults")}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      <div className="mt-4 border-t border-border pt-8">
        <SuggestedBooks existingTitles={books.map((book) => book.title)} />
      </div>
    </div>
  );
}
