import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { ThemeTag } from "@/components/ThemeTag";
import { RatingStars } from "@/components/RatingStars";
import type { Book } from "@/types/book";

export function BookCard({ book }: { book: Book }) {
  const t = useTranslations("bookCard");

  return (
    <Link
      href={`/books/${book.id}`}
      className="group flex gap-4 rounded-2xl border border-border bg-surface p-4 transition-shadow hover:shadow-md"
    >
      <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
        {book.coverUrl ? (
          <Image
            src={book.coverUrl}
            alt=""
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-serif text-2xl text-muted">
            {book.title.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div>
          <h3 className="truncate font-serif text-lg font-semibold text-foreground group-hover:text-accent">
            {book.title}
          </h3>
          <p className="text-sm text-muted">{t("by", { author: book.author })}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={book.status} />
          {book.rating > 0 && <RatingStars rating={book.rating} />}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {book.themes.slice(0, 3).map((theme) => (
            <ThemeTag key={theme} theme={theme} />
          ))}
        </div>
      </div>
    </Link>
  );
}
