import type { Book, BookDraft } from "@/types/book";

const STORAGE_KEY = "bookmemo:books";
const EMPTY: Book[] = [];

let cache: Book[] = EMPTY;
let hasLoaded = false;
const listeners = new Set<() => void>();

function loadFromStorage(): Book[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return EMPTY;
  try {
    return JSON.parse(raw) as Book[];
  } catch {
    return EMPTY;
  }
}

function persist(books: Book[]) {
  cache = books;
  hasLoaded = true;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): Book[] {
  if (!hasLoaded) {
    cache = loadFromStorage();
    hasLoaded = true;
  }
  return cache;
}

export function getServerSnapshot(): Book[] {
  return EMPTY;
}

export function createBook(draft: BookDraft): Book {
  const now = new Date().toISOString();
  const book: Book = {
    ...draft,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  persist([...getSnapshot(), book]);
  return book;
}

export function updateBook(id: string, draft: BookDraft): Book | undefined {
  const books = getSnapshot();
  const index = books.findIndex((book) => book.id === id);
  if (index === -1) return undefined;
  const updated: Book = {
    ...books[index],
    ...draft,
    updatedAt: new Date().toISOString(),
  };
  const next = [...books];
  next[index] = updated;
  persist(next);
  return updated;
}

export function deleteBook(id: string) {
  persist(getSnapshot().filter((book) => book.id !== id));
}
