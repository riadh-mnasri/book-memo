import { NextRequest, NextResponse } from "next/server";

interface OpenLibraryDoc {
  cover_i?: number;
}

interface OpenLibraryResponse {
  docs: OpenLibraryDoc[];
}

export async function GET(request: NextRequest) {
  const title = request.nextUrl.searchParams.get("title")?.trim();
  const author = request.nextUrl.searchParams.get("author")?.trim();

  if (!title) {
    return NextResponse.json({ coverUrl: null });
  }

  const params = new URLSearchParams({ title, limit: "1" });
  if (author) params.set("author", author);

  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?${params.toString()}`,
      { signal: AbortSignal.timeout(5000) },
    );
    if (!response.ok) {
      return NextResponse.json({ coverUrl: null });
    }
    const data = (await response.json()) as OpenLibraryResponse;
    const coverId = data.docs[0]?.cover_i;
    const coverUrl = coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
      : null;
    return NextResponse.json({ coverUrl });
  } catch {
    return NextResponse.json({ coverUrl: null });
  }
}
