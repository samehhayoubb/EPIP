import type { Role } from "./types";

// UI convenience only. The backend is the real authority:
// a CEO who bypassed the UI would still get a 403.
const UPLOAD_ROLES: Role[] = [
  "admin",
  "projects_manager",
  "project_manager",
  "engineer",
  "document_control",
];

export function canUpload(role: Role): boolean {
  return UPLOAD_ROLES.includes(role);
}