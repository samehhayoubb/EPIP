"use client";

import { useState } from "react";
import { StatCard } from "./stat-card";
import { useCurrentUser } from "@/components/current-user-provider";
import { projectStats } from "@/lib/mock-data";
import { formatEgp } from "@/lib/format";
import type { Project } from "@/lib/types";

export function ProjectView({ projects }: { projects: Project[] }) {
  const { user } = useCurrentUser();
  const [selectedId, setSelectedId] = useState(projects[0]?.id);

  const selected = projects.find((p) => p.id === selectedId) ?? projects[0];

  if (!selected) {
    return (
      <p className="text-muted-foreground">
        You are not assigned to any projects yet.
      </p>
    );
  }

  const stats = projectStats[selected.id];
  const showCommercial = user.role !== "engineer";

  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs text-muted-foreground">Project</label>
        <select
          className="mt-1 block w-full max-w-xs rounded-md border bg-background p-2 text-sm"
          value={selected.id}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Documents" value={stats.documents} />
        <StatCard label="Open RFIs" value={stats.openRfis} />
        <StatCard label="Pending reviews" value={stats.pendingReviews} />
        <StatCard label="Open AI findings" value={stats.openFindings} />
        <StatCard label="Progress" value={`${stats.progress}%`} />
        {showCommercial && (
          <>
            <StatCard label="Contract value" value={formatEgp(stats.contractValue)} />
            <StatCard label="Invoiced" value={formatEgp(stats.invoicedValue)} />
          </>
        )}
      </div>
    </div>
  );
}