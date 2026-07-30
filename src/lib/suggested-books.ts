export interface SuggestedBook {
  title: string;
  author: string;
  themes: string[];
}

export const SUGGESTED_BOOKS: SuggestedBook[] = [
  { title: "Clean Architecture", author: "Robert C. Martin", themes: ["techDev"] },
  { title: "Domain-Driven Design", author: "Eric Evans", themes: ["techDev"] },
  {
    title: "The Pragmatic Programmer",
    author: "David Thomas, Andrew Hunt",
    themes: ["techDev", "productivity"],
  },
  { title: "Team Topologies", author: "Matthew Skelton, Manuel Pais", themes: ["techDev", "leadership"] },
  { title: "Deep Work", author: "Cal Newport", themes: ["productivity", "personalDev"] },
  { title: "Atomic Habits", author: "James Clear", themes: ["personalDev", "productivity"] },
  { title: "The Psychology of Money", author: "Morgan Housel", themes: ["finance", "psychology"] },
  { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", themes: ["psychology"] },
  { title: "Company of One", author: "Paul Jarvis", themes: ["business", "personalDev"] },
  { title: "The Lean Startup", author: "Eric Ries", themes: ["business"] },
];
