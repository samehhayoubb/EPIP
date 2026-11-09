import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/components/current-user-provider";
import { apiFetch } from "@/lib/api-client";
import type { ApiDocument } from "@/lib/api-types";

export function useDocuments(projectId: string | undefined) {
  const { user } = useCurrentUser();

  return useQuery({
    queryKey: ["documents", user.email, projectId],
    queryFn: () =>
      apiFetch<ApiDocument[]>(`/api/projects/${projectId}/documents`, user.email),
    enabled: !!projectId,
  });
}

export function useUploadDocument(projectId: string | undefined) {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      apiFetch<ApiDocument>(`/api/projects/${projectId}/documents`, user.email, {
        method: "POST",
        body: formData,
      }),
    // After a successful upload, refetch the list so the new row appears
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["documents", user.email, projectId],
      }),
  });
}