"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Calculator,
  Ruler,
  ClipboardCheck,
  Bot,
  BarChart3,
  House,
} from "lucide-react";

import { useCurrentUser } from "@/components/current-user-provider";
import { users } from "@/lib/mock-data";
import { roleLabels } from "@/lib/access";


const nav = [
  { href: "/", label: "Home", icon: House },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/boq", label: "BOQ & Invoices", icon: Calculator },
  { href: "/qs", label: "Quantity Surveying", icon: Ruler },
  { href: "/technical", label: "Technical", icon: ClipboardCheck },
  { href: "/assistant", label: "AI Assistant", icon: Bot },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

export function Sidebar() {
  const { user, setUserId } = useCurrentUser();
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r bg-muted/40 p-4">
      <div className="mb-6 px-2">
        <p className="text-lg font-bold">EPIP</p>
        <p className="text-xs text-muted-foreground">Project Intelligence</p>
      </div>
      <nav className="space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-md px-2 py-2 text-sm ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      {process.env.NODE_ENV === "development" && (
        <div className="mt-6 border-t px-2 pt-4">
          <label className="text-xs text-muted-foreground">View as (dev only)</label>
          <select
            className="mt-1 w-full rounded-md border bg-background p-1 text-sm"
            value={user.id}
            onChange={(e) => setUserId(e.target.value)}
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({roleLabels[u.role]})
              </option>
            ))}
          </select>
        </div>
      )}
    </aside>
  );
}