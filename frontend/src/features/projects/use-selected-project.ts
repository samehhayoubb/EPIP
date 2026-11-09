import { useState } from "react";
import { useProjects } from "./hooks";

export function useSelectedProject() {
  const projects = useProjects();
  const [selectedId, setSelectedId] = useState<string | undefined>();

  // Derived: falls back to the first project if nothing valid is selected
  const selected =
    projects.data?.find((p) => p.id === selectedId) ?? projects.data?.[0];

  return { projects, selected, setSelectedId };
}