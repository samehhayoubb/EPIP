import { NativeSelect } from "@/components/native-select";
import type { ApiProject } from "@/lib/api-types";

type ProjectSelectProps = {
  projects: ApiProject[];
  value?: string;
  onChange: (id: string) => void;
};

export function ProjectSelect({ projects, value, onChange }: ProjectSelectProps) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">Project</label>
      <NativeSelect
        className="mt-1 min-w-56"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={projects.length === 0}
      >
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </NativeSelect>
    </div>
  );
}