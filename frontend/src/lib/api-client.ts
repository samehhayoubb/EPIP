const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** The single place where the frontend talks to the backend. */
export async function apiFetch<T>(
  path: string,
  userEmail: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  // TEMPORARY dev auth; replaced by a real login token later
  headers.set("X-User-Email", userEmail);

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      if (typeof body.detail === "string") message = body.detail;
    } catch {
      // response had no JSON body; keep the status text
    }
    throw new ApiError(res.status, message);
  }

  return res.json() as Promise<T>;
}