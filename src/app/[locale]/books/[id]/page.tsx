"use client";

import { use, useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useBook, useBooks } from "@/hooks/useBooks";
import { StatusBadge } from "@/components/StatusBadge";
import { ThemeTag } from "@/components/ThemeTag";
import { RatingStars } from "@/components/RatingStars";

const WORDS_PER_MINUTE = 200;

export default function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const t = useTranslations("bookDetail");
  const book = useBook(id);
  const { removeBook } = useBooks();
  const router = useRouter();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const readingMinutes = useMemo(() => {
    if (!book) return 0;
    const words = [
      ...book.keyIdeas,
      ...book.takeaways,
      ...book.tips,
      ...book.howToApply,
    ]
      .join(" ")
      .split(/\s+/)
      .filter(Boolean).length;
    return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  }, [book]);

  if (book === undefined) return null;
  if (book === null) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-muted">{t("notFound")}</p>
        <Link href="/" className="text-accent underline">
          {t("backToCatalog")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Link href="/" className="no-print text-sm text-muted hover:text-accent">
        ← {t("back")}
      </Link>

      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="relative h-48 w-32 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-muted">
          {book.coverUrl ? (
            <Image
              src={book.coverUrl}
              alt=""
              fill
              sizes="128px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-serif text-4xl text-muted">
              {book.title.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <div>
            <h1 className="font-serif text-3xl font-semibold">{book.title}</h1>
            <p className="text-muted">{book.author}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={book.status} />
            {book.rating > 0 && <RatingStars rating={book.rating} />}
            <span className="text-sm text-muted">{t("readingTime", { minutes: readingMinutes })}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {book.themes.map((theme) => (
              <ThemeTag key={theme} theme={theme} />
            ))}
          </div>
          <div className="no-print mt-2 flex flex-wrap gap-3">
            <Link
              href={`/books/${id}/edit`}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-accent hover:text-accent"
            >
              {t("edit")}
            </Link>
            <button
              onClick={() => window.print()}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-accent hover:text-accent"
            >
              {t("print")}
            </button>
            <button
              onClick={() => setConfirmingDelete(true)}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-red-500 hover:border-red-400"
            >
              {t("delete")}
            </button>
          </div>
        </div>
      </div>

      {confirmingDelete && (
        <div className="no-print rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="font-medium text-red-700">{t("deleteConfirmTitle")}</p>
          <p className="mt-1 text-sm text-red-600">
            {t("deleteConfirmBody", { title: book.title })}
          </p>
          <div className="mt-3 flex gap-3">
            <button
              onClick={() => {
                removeBook(id);
                router.push("/");
              }}
              className="rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
            >
              {t("deleteConfirmAction")}
            </button>
            <button
              onClick={() => setConfirmingDelete(false)}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <ReadingSection title={t("keyIdeas")} items={book.keyIdeas} defaultOpen />
        <ReadingSection title={t("takeaways")} items={book.takeaways} defaultOpen />
        <ReadingSection title={t("tips")} items={book.tips} />
        <ReadingSection title={t("howToApply")} items={book.howToApply} />
      </div>
    </div>
  );
}

function ReadingSection({
  title,
  items,
  defaultOpen = false,
}: {
  title: string;
  items: string[];
  defaultOpen?: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <details
      open={defaultOpen}
      className="group rounded-2xl border border-border bg-surface p-5 open:pb-6"
    >
      <summary className="cursor-pointer list-none font-serif text-xl font-semibold text-foreground">
        <span className="mr-2 inline-block transition-transform group-open:rotate-90">
          ›
        </span>
        {title}
      </summary>
      <ul className="mt-4 flex flex-col gap-3">
        {items.map((item, index) => (
          <li key={index} className="flex gap-3 leading-relaxed text-foreground/90">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}
