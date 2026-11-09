export type ApiProject = {
  id: string;
  organization_id: string;
  name: string;
  status: string;
};

export type ApiRevision = {
  id: string;
  revision_label: string;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  language: string | null;
  extraction_status: string;
  uploaded_at: string;
};

export type ApiDocument = {
  id: string;
  project_id: string;
  title: string;
  doc_number: string | null;
  doc_type: string;
  discipline: string | null;
  created_at: string;
  revisions: ApiRevision[];
};