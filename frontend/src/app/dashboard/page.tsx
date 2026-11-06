"use client";

import { useCurrentUser } from "@/components/current-user-provider";
import { getAccessibleProjects, roleLabels } from "@/lib/access";

export default function DashboardPage() {
  const { user } = useCurrentUser();
  const accessible = getAccessibleProjects(user);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">
        {user.name} · {roleLabels[user.role]}
      </p>

      <h2 className="mt-6 font-semibold">
        Accessible projects ({accessible.length})
      </h2>
      <ul className="mt-2 list-disc pl-5">
        {accessible.map((p) => (
          <li key={p.id}>
            {p.name} <span className="text-muted-foreground">({p.status})</span>
          </li>
        ))}
      </ul>
    </main>
  );
}