import { useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "@/components/current-user-provider";
import { apiFetch } from "@/lib/api-client";
import type { ApiProject } from "@/lib/api-types";

export function useProjects() {
  const { user } = useCurrentUser();

  return useQuery({
    // The email is part of the key, so switching user fetches fresh data
    // instead of showing the previous user's cached projects.
    queryKey: ["projects", user.email],
    queryFn: () => apiFetch<ApiProject[]>("/api/projects", user.email),
  });
}