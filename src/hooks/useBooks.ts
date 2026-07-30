"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import * as storage from "@/lib/storage";
import type { Book, BookDraft } from "@/types/book";

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function useBooks() {
  const books = useSyncExternalStore(
    storage.subscribe,
    storage.getSnapshot,
    storage.getServerSnapshot,
  );
  const isLoaded = useHydrated();

  const sorted = useMemo(
    () =>
      [...books].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [books],
  );

  const addBook = useCallback((draft: BookDraft) => storage.createBook(draft), []);
  const editBook = useCallback(
    (id: string, draft: BookDraft) => storage.updateBook(id, draft),
    [],
  );
  const removeBook = useCallback((id: string) => storage.deleteBook(id), []);

  return { books: sorted, isLoaded, addBook, editBook, removeBook };
}

export function useBook(id: string): Book | null | undefined {
  const books = useSyncExternalStore(
    storage.subscribe,
    storage.getSnapshot,
    storage.getServerSnapshot,
  );
  const isLoaded = useHydrated();

  if (!isLoaded) return undefined;
  return books.find((book) => book.id === id) ?? null;
}
