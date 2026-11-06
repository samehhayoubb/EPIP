import type { Organization, User, Project, ProjectMember,ProjectStats } from "./types";

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


export const projectStats: Record<string, ProjectStats> = {
  p1: { documents: 412, openRfis: 9, pendingReviews: 14, openFindings: 6, contractValue: 250_000_000, invoicedValue: 96_000_000, progress: 38 },
  p2: { documents: 268, openRfis: 5, pendingReviews: 8, openFindings: 3, contractValue: 180_000_000, invoicedValue: 54_000_000, progress: 30 },
  p3: { documents: 150, openRfis: 2, pendingReviews: 1, openFindings: 1, contractValue: 320_000_000, invoicedValue: 40_000_000, progress: 12 },
  p4: { documents: 530, openRfis: 0, pendingReviews: 0, openFindings: 0, contractValue: 90_000_000, invoicedValue: 90_000_000, progress: 100 },
  p5: { documents: 205, openRfis: 7, pendingReviews: 6, openFindings: 4, contractValue: 140_000_000, invoicedValue: 35_000_000, progress: 25 },
  p6: { documents: 320, openRfis: 11, pendingReviews: 10, openFindings: 8, contractValue: 210_000_000, invoicedValue: 120_000_000, progress: 57 },
};