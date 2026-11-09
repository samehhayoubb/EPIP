"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/native-select";
import { ApiError } from "@/lib/api-client";
import { DISCIPLINES, DOC_TYPES } from "./constants";
import { useUploadDocument } from "./hooks";

const FILE_ACCEPT =
  ".pdf,.xlsx,.xlsm,.xls,.docx,.doc,.dwg,.dxf,.png,.jpg,.jpeg,.tif,.tiff";

type UploadDialogProps = {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UploadDialog({ projectId, open, onOpenChange }: UploadDialogProps) {
  const upload = useUploadDocument(projectId);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [docType, setDocType] = useState("mir");
  const [discipline, setDiscipline] = useState("");
  const [docNumber, setDocNumber] = useState("");
  const [revision, setRevision] = useState("A");
  const [force, setForce] = useState(false);
  const [duplicate, setDuplicate] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setFile(null);
    setTitle("");
    setDocType("mir");
    setDiscipline("");
    setDocNumber("");
    setRevision("A");
    setForce(false);
    setDuplicate(false);
    setError(null);
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset();
    onOpenChange(next);
  }

  function handleFileChange(selected: File | null) {
    setFile(selected);
    setError(null);
    setDuplicate(false);
    setForce(false);
    // Suggest a title from the file name if the title is still empty
    if (selected && !title) {
      setTitle(selected.name.replace(/\.[^.]+$/, ""));
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) {
      setError("Choose a file first.");
      return;
    }

    const body = new FormData();
    body.append("file", file);
    body.append("title", title);
    body.append("doc_type", docType);
    if (discipline) body.append("discipline", discipline);
    if (docNumber) body.append("doc_number", docNumber);
    body.append("revision_label", revision);
    body.append("force", String(force));

    setError(null);
    upload.mutate(body, {
      onSuccess: () => handleOpenChange(false),
      onError: (err) => {
        setError(err.message);
        setDuplicate(err instanceof ApiError && err.status === 409);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload document</DialogTitle>
          <DialogDescription>
            Add a file and its details. The original file is stored unchanged.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="file">File</Label>
            <Input
              id="file"
              type="file"
              accept={FILE_ACCEPT}
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={300}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="doc-type">Type</Label>
              <NativeSelect
                id="doc-type"
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
              >
                {DOC_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </NativeSelect>
            </div>

            <div className="space-y-1">
              <Label htmlFor="discipline">Discipline</Label>
              <NativeSelect
                id="discipline"
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
              >
                <option value="">Not specified</option>
                {DISCIPLINES.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </NativeSelect>
            </div>

            <div className="space-y-1">
              <Label htmlFor="doc-number">Document number</Label>
              <Input
                id="doc-number"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                maxLength={100}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="revision">Revision</Label>
              <Input
                id="revision"
                value={revision}
                onChange={(e) => setRevision(e.target.value)}
                maxLength={20}
                required
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {duplicate && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={force}
                onChange={(e) => setForce(e.target.checked)}
              />
              Upload anyway
            </label>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={upload.isPending}>
              {upload.isPending ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}