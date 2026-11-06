"use client";

import { Badge } from "@/components/ui/badge";
import { PortfolioView } from "@/components/dashboard/portfolio-view";
import { ProjectView } from "@/components/dashboard/project-view";
import { useCurrentUser } from "@/components/current-user-provider";
import {
  getAccessibleProjects,
  hasPortfolioView,
  roleLabels,
} from "@/lib/access";

export default function DashboardPage() {
  const { user } = useCurrentUser();
  const accessible = getAccessibleProjects(user);

  return (
    <main className="space-y-6 p-8">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            {user.name} · {roleLabels[user.role]}
          </p>
        </div>
        <Badge variant="outline">Sample data</Badge>
      </header>

      {hasPortfolioView(user) ? (
        <PortfolioView projects={accessible} />
      ) : (
        <ProjectView key={user.id} projects={accessible} />
      )}
    </main>
  );
}