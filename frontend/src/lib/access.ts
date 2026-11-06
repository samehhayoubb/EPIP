import { projects, members } from "./mock-data";
import type { Project, Role, User } from "./types";

export const roleLabels: Record<Role, string> = {
  admin: "Admin",
  ceo: "Company CEO",
  projects_manager: "Projects Manager",
  project_manager: "Project Manager",
  engineer: "Engineer",
};

export function getAccessibleProjects(user: User): Project[] {
  switch (user.role) {
    case "admin":
      return projects;

    case "ceo":
    case "projects_manager":
      return projects.filter((p) => p.organizationId === user.organizationId);

    case "project_manager":
    case "engineer": {
      const assigned = new Set(
        members.filter((m) => m.userId === user.id).map((m) => m.projectId)
      );
      return projects.filter(
        (p) => assigned.has(p.id) && p.organizationId === user.organizationId
      );
    }
  }
}