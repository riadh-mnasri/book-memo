"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { RatingStars } from "@/components/RatingStars";
import { ThemeTag } from "@/components/ThemeTag";
import { THEME_KEYS } from "@/types/book";
import type { Book, BookDraft, ReadingStatus } from "@/types/book";

interface BookFormProps {
  mode: "add" | "edit";
  initial?: Book;
  initialTitle?: string;
  initialAuthor?: string;
  initialThemes?: string[];
  onSubmit: (draft: BookDraft) => void;
  onCancel: () => void;
}

function linesToText(lines: string[]) {
  return lines.join("\n");
}

function textToLines(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function BookForm({
  mode,
  initial,
  initialTitle,
  initialAuthor,
  initialThemes,
  onSubmit,
  onCancel,
}: BookFormProps) {
  const t = useTranslations("bookForm");
  const tThemes = useTranslations("themes");
  const tStatus = useTranslations("status");
  const locale = useLocale();

  const [title, setTitle] = useState(initial?.title ?? initialTitle ?? "");
  const [author, setAuthor] = useState(initial?.author ?? initialAuthor ?? "");
  const [themes, setThemes] = useState<string[]>(initial?.themes ?? initialThemes ?? []);
  const [themeInput, setThemeInput] = useState("");
  const [status, setStatus] = useState<ReadingStatus>(initial?.status ?? "to-read");
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [coverUrl, setCoverUrl] = useState<string | null>(initial?.coverUrl ?? null);
  const [isCoverSearching, setIsCoverSearching] = useState(false);
  const [keyIdeasText, setKeyIdeasText] = useState(linesToText(initial?.keyIdeas ?? []));
  const [takeawaysText, setTakeawaysText] = useState(linesToText(initial?.takeaways ?? []));
  const [tipsText, setTipsText] = useState(linesToText(initial?.tips ?? []));
  const [howToApplyText, setHowToApplyText] = useState(
    linesToText(initial?.howToApply ?? []),
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState(false);
  const [draftApplied, setDraftApplied] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [authorError, setAuthorError] = useState(false);

  const searchCover = useCallback(async (bookTitle: string, bookAuthor: string) => {
    if (!bookTitle.trim()) return;
    setIsCoverSearching(true);
    try {
      const params = new URLSearchParams({ title: bookTitle });
      if (bookAuthor.trim()) params.set("author", bookAuthor);
      const response = await fetch(`/api/cover-search?${params.toString()}`);
      const data = await response.json();
      setCoverUrl((current) => current ?? data.coverUrl ?? null);
    } catch {
      // silently ignore, cover is optional
    } finally {
      setIsCoverSearching(false);
    }
  }, []);

  const generateDraft = useCallback(async () => {
    if (!title.trim()) return;
    setIsGenerating(true);
    setGenerateError(false);
    try {
      const response = await fetch("/api/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, locale }),
      });
      if (!response.ok) throw new Error("failed");
      const data = await response.json();
      setKeyIdeasText((current) => current || linesToText(data.keyIdeas ?? []));
      setTakeawaysText((current) => current || linesToText(data.takeaways ?? []));
      setTipsText((current) => current || linesToText(data.tips ?? []));
      setHowToApplyText((current) => current || linesToText(data.howToApply ?? []));
      setThemes((current) => (current.length > 0 ? current : data.themes ?? []));
      setDraftApplied(true);
    } catch {
      setGenerateError(true);
    } finally {
      setIsGenerating(false);
    }
  }, [title, author, locale]);

  const handleTitleAuthorBlur = useCallback(() => {
    if (mode !== "add" || !title.trim()) return;
    searchCover(title, author);
    generateDraft();
  }, [mode, title, author, searchCover, generateDraft]);

  useEffect(() => {
    // One-off kickoff for a suggestion prefilled via URL params, not a state sync.
    if (mode === "add" && initialTitle) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      searchCover(initialTitle, initialAuthor ?? "");
      generateDraft();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTheme = (value: string) => {
    const clean = value.trim();
    if (!clean || themes.includes(clean)) return;
    setThemes([...themes, clean]);
    setThemeInput("");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validTitle = title.trim().length > 0;
    const validAuthor = author.trim().length > 0;
    setTitleError(!validTitle);
    setAuthorError(!validAuthor);
    if (!validTitle || !validAuthor) return;

    onSubmit({
      title: title.trim(),
      author: author.trim(),
      themes,
      status,
      rating,
      coverUrl,
      keyIdeas: textToLines(keyIdeasText),
      takeaways: textToLines(takeawaysText),
      tips: textToLines(tipsText),
      howToApply: textToLines(howToApplyText),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <h1 className="font-serif text-2xl font-semibold">
        {mode === "add" ? t("addTitle") : t("editTitle")}
      </h1>

      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="flex flex-col items-center gap-2">
          <div className="relative h-40 w-28 overflow-hidden rounded-lg border border-border bg-surface-muted">
            {coverUrl ? (
              <Image src={coverUrl} alt="" fill sizes="112px" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted">
                {isCoverSearching ? t("coverSearching") : t("coverLabel")}
              </div>
            )}
          </div>
          {mode === "add" && !isCoverSearching && (
            <button
              type="button"
              onClick={() => searchCover(title, author)}
              className="-mx-2 px-2 py-1.5 text-xs text-muted underline decoration-dotted hover:text-accent"
            >
              {t("coverRetry")}
            </button>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">{t("titleLabel")}</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onBlur={handleTitleAuthorBlur}
              placeholder={t("titlePlaceholder")}
              className={`rounded-lg border bg-surface px-3 py-2 text-sm focus:outline-none ${
                titleError ? "border-red-400" : "border-border focus:border-accent"
              }`}
            />
            {titleError && <p className="text-xs text-red-500">{t("titleRequired")}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">{t("authorLabel")}</label>
            <input
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              onBlur={handleTitleAuthorBlur}
              placeholder={t("authorPlaceholder")}
              className={`rounded-lg border bg-surface px-3 py-2 text-sm focus:outline-none ${
                authorError ? "border-red-400" : "border-border focus:border-accent"
              }`}
            />
            {authorError && <p className="text-xs text-red-500">{t("authorRequired")}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">{t("statusLabel")}</label>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as ReadingStatus)}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              >
                <option value="to-read">{tStatus("toRead")}</option>
                <option value="reading">{tStatus("reading")}</option>
                <option value="read">{tStatus("read")}</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">{t("ratingLabel")}</label>
              <RatingStars rating={rating} onChange={setRating} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">{t("themesLabel")}</label>
        <div className="flex flex-wrap items-center gap-2">
          {themes.map((theme) => (
            <button
              key={theme}
              type="button"
              onClick={() => setThemes(themes.filter((th) => th !== theme))}
              className="group"
            >
              <ThemeTag theme={theme} className="group-hover:bg-red-100 group-hover:text-red-600" />
            </button>
          ))}
          <input
            value={themeInput}
            onChange={(event) => setThemeInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addTheme(themeInput);
              }
            }}
            placeholder={t("themesPlaceholder")}
            className="min-w-[10rem] flex-1 rounded-full border border-border bg-surface px-3 py-1.5 text-sm focus:border-accent focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {THEME_KEYS.filter((key) => !themes.includes(key)).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => addTheme(key)}
              className="rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted hover:border-accent hover:text-accent"
            >
              + {tThemes(key)}
            </button>
          ))}
        </div>
      </div>

      {mode === "add" && (
        <div className="rounded-xl border border-border bg-surface-muted p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">{t("generateHelp")}</p>
            <button
              type="button"
              onClick={generateDraft}
              disabled={isGenerating || !title.trim()}
              className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground disabled:opacity-50"
            >
              {isGenerating ? t("generating") : t("generateDraft")}
            </button>
          </div>
          {draftApplied && !isGenerating && (
            <p className="mt-2 text-xs text-accent">{t("draftNotice")}</p>
          )}
          {generateError && (
            <p className="mt-2 text-xs text-red-500">{t("generateError")}</p>
          )}
        </div>
      )}

      <SummaryField
        label={t("keyIdeasLabel")}
        help={t("keyIdeasHelp")}
        value={keyIdeasText}
        onChange={setKeyIdeasText}
      />
      <SummaryField
        label={t("takeawaysLabel")}
        help={t("takeawaysHelp")}
        value={takeawaysText}
        onChange={setTakeawaysText}
      />
      <SummaryField
        label={t("tipsLabel")}
        help={t("tipsHelp")}
        value={tipsText}
        onChange={setTipsText}
      />
      <SummaryField
        label={t("howToApplyLabel")}
        help={t("howToApplyHelp")}
        value={howToApplyText}
        onChange={setHowToApplyText}
      />

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted hover:text-foreground"
        >
          {t("cancel")}
        </button>
        <button
          type="submit"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          {t("save")}
        </button>
      </div>
    </form>
  );
}

function SummaryField({
  label,
  help,
  value,
  onChange,
}: {
  label: string;
  help: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium">{label}</label>
      <p className="text-xs text-muted">{help}</p>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
      />
    </div>
  );
}
