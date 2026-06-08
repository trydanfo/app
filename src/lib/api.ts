const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"

export class ApiError extends Error {
  status: number
  body: Record<string, unknown> | null
  constructor(status: number, message: string, body: Record<string, unknown> | null = null) {
    super(message)
    this.status = status
    this.body = body
  }
}

export async function api<TResponse>(path: string, options: RequestInit = {}): Promise<TResponse> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
  })

  if (!response.ok) {
    let message = response.statusText
    let body: Record<string, unknown> | null = null
    try {
      body = await response.json()
      message = (body?.error as string) ?? message
    } catch {
      // NOTE: body was not json, fall back to the status text
    }
    throw new ApiError(response.status, message, body)
  }

  if (response.status === 204) {
    return undefined as TResponse
  }
  return (await response.json()) as TResponse
}

export const apiBase = apiBaseUrl
