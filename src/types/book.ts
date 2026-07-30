export type ReadingStatus = "to-read" | "reading" | "read";

export interface Book {
  id: string;
  title: string;
  author: string;
  themes: string[];
  keyIdeas: string[];
  takeaways: string[];
  tips: string[];
  howToApply: string[];
  status: ReadingStatus;
  rating: number;
  coverUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export type BookDraft = Omit<Book, "id" | "createdAt" | "updatedAt">;

export const THEME_KEYS = [
  "business",
  "personalDev",
  "psychology",
  "finance",
  "techDev",
  "productivity",
  "leadership",
  "health",
  "philosophy",
  "creativity",
] as const;
