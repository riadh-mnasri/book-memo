"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { BookForm } from "@/components/BookForm";
import { useBook, useBooks } from "@/hooks/useBooks";
import { useRouter } from "@/i18n/navigation";
import type { BookDraft } from "@/types/book";

export default function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const t = useTranslations("bookDetail");
  const book = useBook(id);
  const { editBook } = useBooks();
  const router = useRouter();

  if (book === undefined) return null;
  if (book === null) {
    return <p className="text-center text-muted">{t("notFound")}</p>;
  }

  const handleSubmit = (draft: BookDraft) => {
    editBook(id, draft);
    router.push(`/books/${id}`);
  };

  return (
    <BookForm
      mode="edit"
      initial={book}
      onSubmit={handleSubmit}
      onCancel={() => router.push(`/books/${id}`)}
    />
  );
}
