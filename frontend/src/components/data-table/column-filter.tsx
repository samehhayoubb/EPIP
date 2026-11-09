"use client";

import type { Column } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/native-select";
import type { DateRange } from "./filter-fns";

export function ColumnFilter<TData>({
  column,
}: {
  column: Column<TData, unknown>;
}) {
  const config = column.columnDef.meta?.filter;
  if (!config) return null;

  if (config.type === "select") {
    return (
      <div>
        <label className="text-xs text-muted-foreground">{config.label}</label>
        <NativeSelect
          className="mt-1 min-w-36"
          value={(column.getFilterValue() as string | undefined) ?? ""}
          onChange={(e) => column.setFilterValue(e.target.value || undefined)}
        >
          <option value="">All</option>
          {config.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </NativeSelect>
      </div>
    );
  }

  // date-range
  const range = (column.getFilterValue() as DateRange | undefined) ?? {};

  function update(part: keyof DateRange, value: string) {
    const next = { ...range, [part]: value || undefined };
    column.setFilterValue(next.from || next.to ? next : undefined);
  }

  return (
    <div>
      <label className="text-xs text-muted-foreground">{config.label}</label>
      <div className="mt-1 flex items-center gap-2">
        <Input
          type="date"
          aria-label={`${config.label} from`}
          value={range.from ?? ""}
          onChange={(e) => update("from", e.target.value)}
          className="w-auto"
        />
        <span className="text-xs text-muted-foreground">to</span>
        <Input
          type="date"
          aria-label={`${config.label} to`}
          value={range.to ?? ""}
          onChange={(e) => update("to", e.target.value)}
          className="w-auto"
        />
      </div>
    </div>
  );
}