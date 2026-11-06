import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatCard } from "./stat-card";
import { projectStats } from "@/lib/mock-data";
import { sumStats } from "@/lib/access";
import { formatEgp } from "@/lib/format";
import type { Project } from "@/lib/types";

const statusBadge = {
  active: { label: "Active", variant: "default" },
  on_hold: { label: "On hold", variant: "secondary" },
  completed: { label: "Completed", variant: "outline" },
} as const;

export function PortfolioView({ projects }: { projects: Project[] }) {
  const totals = sumStats(projects);
  const activeCount = projects.filter((p) => p.status === "active").length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Projects" value={projects.length} hint={`${activeCount} active`} />
        <StatCard label="Documents" value={totals.documents} />
        <StatCard label="Open RFIs" value={totals.openRfis} />
        <StatCard label="Pending reviews" value={totals.pendingReviews} />
        <StatCard label="Open AI findings" value={totals.openFindings} />
        <StatCard label="Contract value" value={formatEgp(totals.contractValue)} />
        <StatCard label="Invoiced" value={formatEgp(totals.invoicedValue)} />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="text-right">Open RFIs</TableHead>
              <TableHead className="text-right">Pending reviews</TableHead>
              <TableHead className="text-right">Contract value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((p) => {
              const s = projectStats[p.id];
              const badge = statusBadge[p.status];
              return (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${s.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{s.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{s.openRfis}</TableCell>
                  <TableCell className="text-right">{s.pendingReviews}</TableCell>
                  <TableCell className="text-right">{formatEgp(s.contractValue)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}