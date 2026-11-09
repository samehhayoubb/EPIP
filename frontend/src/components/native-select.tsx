import * as React from "react";
import { cn } from "@/lib/utils";

export function NativeSelect({
  className,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <select
      className={cn("h-9 w-full rounded-md border bg-background px-2 text-sm", className)}
      {...props}
    />
  );
}