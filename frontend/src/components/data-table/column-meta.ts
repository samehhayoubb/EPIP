import type { RowData } from "@tanstack/react-table";

type SelectOption = { value: string; label: string };

export type ColumnFilterConfig =
  | { type: "select"; label: string; options: readonly SelectOption[] }
  | { type: "date-range"; label: string };

// Lets a column definition carry a `meta.filter` setting
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filter?: ColumnFilterConfig;
  }
}