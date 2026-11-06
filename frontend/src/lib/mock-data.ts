import type { Organization, User, Project, ProjectMember } from "./types";

export const organizations: Organization[] = [
  { id: "GA", name: "Ghoneimi Architects" },
  { id: "SEC", name: "Sectors" },
];

export const users: User[] = [
  { id: "u1", name: "Sameh", role: "admin", organizationId: null },
  { id: "u2", name: "Omar Ghoneimi", role: "ceo", organizationId: "GA" },
  { id: "u3", name: "Saad", role: "projects_manager", organizationId: "GA" },
  { id: "u4", name: "Atef", role: "project_manager", organizationId: "GA" },
  { id: "u5", name: "Shaimaa", role: "engineer", organizationId: "GA" },
  { id: "u6", name: "Random CEO", role: "ceo", organizationId: "SEC" },
  { id: "u7", name: "Random Projects Manager", role: "projects_manager", organizationId: "SEC" },
  { id: "u8", name: "Random Project Manager", role: "project_manager", organizationId: "SEC" },
  { id: "u9", name: "Random Engineer", role: "engineer", organizationId: "SEC" },
];

export const projects: Project[] = [
  { id: "p1", name: "NXT Bank", organizationId: "GA", status: "active" },
  { id: "p2", name: "MLI 41 Kasr Al Nile", organizationId: "GA", status: "completed" },
  { id: "p3", name: "MLI 23 Kasr Al Nile", organizationId: "GA", status: "on_hold" },
  { id: "p4", name: "MCS", organizationId: "GA", status: "active" },
  { id: "p5", name: "Orange Business Center", organizationId: "SEC", status: "completed" },
  { id: "p6", name: "Luxor White Palace", organizationId: "SEC", status: "active" },
];

export const members: ProjectMember[] = [
  { userId: "u4", projectId: "p1" },
  { userId: "u5", projectId: "p1" },
];