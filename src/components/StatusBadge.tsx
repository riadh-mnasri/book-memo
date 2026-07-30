import { useTranslations } from "next-intl";
import type { ReadingStatus } from "@/types/book";

const STATUS_KEY: Record<ReadingStatus, "toRead" | "reading" | "read"> = {
  "to-read": "toRead",
  reading: "reading",
  read: "read",
};

const STATUS_COLOR: Record<ReadingStatus, string> = {
  "to-read": "bg-status-to-read/15 text-status-to-read",
  reading: "bg-status-reading/15 text-status-reading",
  read: "bg-status-read/15 text-status-read",
};

export function StatusBadge({ status }: { status: ReadingStatus }) {
  const t = useTranslations("status");

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLOR[status]}`}
    >
      {t(STATUS_KEY[status])}
    </span>
  );
}
