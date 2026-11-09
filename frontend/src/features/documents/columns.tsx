import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { dateRangeFilter } from "@/components/data-table/filter-fns";
import type { ApiDocument } from "@/lib/api-types";
import { formatBytes, formatDate, humanize } from "@/lib/format";
import { DISCIPLINES, DOC_TYPES, docTypeLabel } from "./constants";

const latest = (d: ApiDocument) => d.revisions.at(-1);

export const documentColumns: ColumnDef<ApiDocument>[] = [
  { accessorKey: "title", header: "Title" },
  {
    accessorKey: "doc_number",
    header: "Number",
    cell: ({ row }) =>
      row.original.doc_number?.replace(/^0+(?=\d)/, "") ?? "—",
  },
  {
    accessorKey: "doc_type",
    header: "Type",
    filterFn: "equalsString",
    meta: { filter: { type: "select", label: "Type", options: DOC_TYPES } },
    cell: ({ row }) => (
      <Badge variant="outline">{docTypeLabel(row.original.doc_type)}</Badge>
    ),
  },
  {
    accessorKey: "discipline",
    header: "Discipline",
    filterFn: "equalsString",
    meta: {
      filter: { type: "select", label: "Discipline", options: DISCIPLINES },
    },
    cell: ({ row }) =>
      row.original.discipline ? humanize(row.original.discipline) : "—",
  },
  {
    id: "revision",
    header: "Rev",
    accessorFn: (d) => latest(d)?.revision_label ?? "—",
  },
  {
    id: "file",
    header: "File",
    accessorFn: (d) => latest(d)?.original_filename ?? "—",
  },
  {
    id: "size",
    header: "Size",
    accessorFn: (d) => latest(d)?.size_bytes ?? 0,
    cell: ({ row }) => formatBytes(latest(row.original)?.size_bytes ?? 0),
  },
  {
    accessorKey: "created_at",
    header: "Uploaded",
    filterFn: dateRangeFilter,
    meta: { filter: { type: "date-range", label: "Uploaded" } },
    cell: ({ row }) => formatDate(row.original.created_at),
  },
];