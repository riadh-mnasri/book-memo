"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ThemeTag } from "@/components/ThemeTag";
import { SUGGESTED_BOOKS } from "@/lib/suggested-books";

export function SuggestedBooks({ existingTitles }: { existingTitles: string[] }) {
  const t = useTranslations("catalog");
  const known = new Set(existingTitles.map((title) => title.toLowerCase()));
  const suggestions = SUGGESTED_BOOKS.filter(
    (book) => !known.has(book.title.toLowerCase()),
  );

  if (suggestions.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="font-serif text-lg font-semibold">{t("suggestedTitle")}</h2>
        <p className="text-sm text-muted">{t("suggestedBody")}</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {suggestions.map((book) => (
          <div
            key={book.title}
            className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-border bg-surface p-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{book.title}</p>
              <p className="truncate text-xs text-muted">{book.author}</p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {book.themes.map((theme) => (
                  <ThemeTag key={theme} theme={theme} />
                ))}
              </div>
            </div>
            <Link
              href={{
                pathname: "/add",
                query: { title: book.title, author: book.author, themes: book.themes.join(",") },
              }}
              className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:border-accent hover:text-accent"
            >
              {t("suggestedAdd")}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
