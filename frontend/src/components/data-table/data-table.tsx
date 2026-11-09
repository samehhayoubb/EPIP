"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ColumnFilter } from "./column-filter";
import "./column-meta";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  emptyMessage?: string;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Search...",
  emptyMessage = "No results.",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, columnFilters },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const rows = table.getRowModel().rows;
  // Columns that declared a filter in their `meta`
  const filterableColumns = table
    .getAllLeafColumns()
    .filter((column) => column.columnDef.meta?.filter);
  const hasActiveFilters = globalFilter !== "" || columnFilters.length > 0;

  function clearFilters() {
    setGlobalFilter("");
    setColumnFilters([]);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="text-xs text-muted-foreground">Search</label>
          <Input
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="mt-1 w-64"
          />
        </div>

        {filterableColumns.map((column) => (
          <ColumnFilter key={column.id} column={column} />
        ))}

        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {rows.length} of {data.length}
      </p>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sorted = header.column.getIsSorted();
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <button
                          type="button"
                          className="flex cursor-pointer select-none items-center gap-1"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {sorted === "asc" ? "▲" : sorted === "desc" ? "▼" : null}
                        </button>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}