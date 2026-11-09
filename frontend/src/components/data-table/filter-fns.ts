import type { FilterFn } from "@tanstack/react-table";

export type DateRange = { from?: string; to?: string };

// Local calendar day as "YYYY-MM-DD", so it compares with <input type="date">
function localDay(iso: string): string {
  const d = new Date(iso);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dateRangeFilter: FilterFn<any> = (row, columnId, range: DateRange) => {
  const day = localDay(row.getValue<string>(columnId));
  if (range.from && day < range.from) return false;
  if (range.to && day > range.to) return false;
  return true;
};