export type Role =
  | "admin"
  | "ceo"
  | "projects_manager"
  | "project_manager"
  | "engineer";

export type Organization = { id: string; name: string };

export type User = {
  id: string;
  name: string;
  role: Role;
  organizationId: string | null; // null for the platform admin
};

export type Project = {
  id: string;
  name: string;
  organizationId: string;
  status: "active" | "on_hold" | "completed";
};

export type ProjectMember = { userId: string; projectId: string };