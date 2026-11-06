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

export type ProjectStats = {
  documents: number;
  openRfis: number;
  pendingReviews: number;
  openFindings: number; // open AI findings
  contractValue: number; // EGP
  invoicedValue: number; // EGP
  progress: number; // 0 to 100
};

export type ProjectMember = { userId: string; projectId: string };