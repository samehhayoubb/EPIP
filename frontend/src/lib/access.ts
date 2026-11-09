import { projects, members, projectStats } from "./mock-data";
import type { Project, Role, User, ProjectStats } from "./types";

export const roleLabels: Record<Role, string> = {
  admin: "Admin",
  ceo: "Company CEO",
  projects_manager: "Projects Manager",
  project_manager: "Project Manager",
  engineer: "Engineer",
  document_control: "Document Control",
};

export function getAccessibleProjects(user: User): Project[] {
  switch (user.role) {
    case "admin":
      return projects;

    case "ceo":
    case "projects_manager":
      return projects.filter((p) => p.organizationId === user.organizationId);

    case "project_manager":
    case "engineer":
    case "document_control": {
      const assigned = new Set(
        members.filter((m) => m.userId === user.id).map((m) => m.projectId)
      );
      return projects.filter(
        (p) => assigned.has(p.id) && p.organizationId === user.organizationId
      );
    }
  }
}


export function hasPortfolioView(user: User): boolean {
  return (
    user.role === "admin" ||
    user.role === "ceo" ||
    user.role === "projects_manager"
  );
}

export function sumStats(list: Project[]): Omit<ProjectStats, "progress"> {
  return list.reduce(
    (total, p) => {
      const s = projectStats[p.id];
      return {
        documents: total.documents + s.documents,
        openRfis: total.openRfis + s.openRfis,
        pendingReviews: total.pendingReviews + s.pendingReviews,
        openFindings: total.openFindings + s.openFindings,
        contractValue: total.contractValue + s.contractValue,
        invoicedValue: total.invoicedValue + s.invoicedValue,
      };
    },
    { documents: 0, openRfis: 0, pendingReviews: 0, openFindings: 0, contractValue: 0, invoicedValue: 0 }
  );
}