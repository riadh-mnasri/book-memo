"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BookForm } from "@/components/BookForm";
import { useBooks } from "@/hooks/useBooks";
import { useRouter } from "@/i18n/navigation";
import type { BookDraft } from "@/types/book";

function AddBookForm() {
  const router = useRouter();
  const { addBook } = useBooks();
  const searchParams = useSearchParams();

  const prefill = {
    title: searchParams.get("title") ?? "",
    author: searchParams.get("author") ?? "",
    themes: searchParams.get("themes")?.split(",").filter(Boolean) ?? [],
  };

  const handleSubmit = (draft: BookDraft) => {
    const book = addBook(draft);
    router.push(`/books/${book.id}`);
  };

  return (
    <BookForm
      mode="add"
      initialTitle={prefill.title}
      initialAuthor={prefill.author}
      initialThemes={prefill.themes}
      onSubmit={handleSubmit}
      onCancel={() => router.push("/")}
    />
  );
}

export default function AddBookPage() {
  return (
    <Suspense fallback={null}>
      <AddBookForm />
    </Suspense>
  );
}
