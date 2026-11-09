"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/data-table";
import { useCurrentUser } from "@/components/current-user-provider";
import { documentColumns } from "@/features/documents/columns";
import { useDocuments } from "@/features/documents/hooks";
import { UploadDialog } from "@/features/documents/upload-dialog";
import { ProjectSelect } from "@/features/projects/project-select";
import { useSelectedProject } from "@/features/projects/use-selected-project";
import { canUpload } from "@/lib/permissions";

export default function DocumentsPage() {
  const { user } = useCurrentUser();
  const { projects, selected, setSelectedId } = useSelectedProject();
  const documents = useDocuments(selected?.id);
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <main className="space-y-6 p-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-muted-foreground">
            Project documents and their revisions.
          </p>
        </div>
        <div className="flex items-end gap-3">
          <ProjectSelect
            projects={projects.data ?? []}
            value={selected?.id}
            onChange={setSelectedId}
          />
          {canUpload(user.role) && selected && (
            <Button onClick={() => setUploadOpen(true)}>Upload document</Button>
          )}
        </div>
      </header>

      {projects.isError && (
        <p className="text-destructive">
          Could not load projects: {projects.error.message}
        </p>
      )}
      {projects.isSuccess && projects.data.length === 0 && (
        <p className="text-muted-foreground">
          You are not assigned to any projects.
        </p>
      )}
      {documents.isLoading && (
        <p className="text-muted-foreground">Loading documents...</p>
      )}
      {documents.isError && (
        <p className="text-destructive">
          Could not load documents: {documents.error.message}
        </p>
      )}
      {documents.isSuccess && (
        <DataTable
          columns={documentColumns}
          data={documents.data}
          searchPlaceholder="Search documents..."
          emptyMessage="No documents in this project yet."
        />
      )}

      {selected && (
        <UploadDialog
          projectId={selected.id}
          open={uploadOpen}
          onOpenChange={setUploadOpen}
        />
      )}
    </main>
  );
}