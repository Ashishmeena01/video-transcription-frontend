const API_BASE = import.meta.env.VITE_API_URL ?? "";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type TokenGetter = () => string | null;
type TokenSetter = (token: string | null) => void;
type LogoutHandler = () => void;

let getAccessToken: TokenGetter = () => null;
let setAccessToken: TokenSetter = () => {};
let onUnauthorized: LogoutHandler = () => {};

export function configureAuthHandlers(handlers: {
  getAccessToken: TokenGetter;
  setAccessToken: TokenSetter;
  onUnauthorized: LogoutHandler;
}) {
  getAccessToken = handlers.getAccessToken;
  setAccessToken = handlers.setAccessToken;
  onUnauthorized = handlers.onUnauthorized;
}

async function parseError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    return data.error || data.message || res.statusText;
  } catch {
    const text = await res.text().catch(() => "");
    return text || res.statusText || "Request failed";
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    return null;
  }

  const data = (await res.json()) as { accessToken?: string };
  if (!data.accessToken) {
    return null;
  }

  setAccessToken(data.accessToken);
  return data.accessToken;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const headers = new Headers(options.headers);
  const token = getAccessToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401 && retry) {
    const nextToken = await refreshAccessToken();
    if (nextToken) {
      return apiFetch<T>(path, options, false);
    }
    onUnauthorized();
    throw new ApiError("Session expired. Please sign in again.", 401);
  }

  if (!res.ok) {
    throw new ApiError(await parseError(res), res.status);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }

  return (await res.text()) as T;
}

export function getGoogleLoginUrl() {
  const base = import.meta.env.VITE_API_URL || "http://localhost:3000";
  return `${base}/api/user/login-google`;
}

export async function transcribeVideo(file: File) {
  const formData = new FormData();
  formData.append("video", file);

  return apiFetch<{ transcript: string }>("/api/ai/transcribe", {
    method: "POST",
    body: formData,
  });
}

export async function sendChatMessage(message: string) {
  return apiFetch<{ response: string }>("/api/ai/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

export async function getUploadSignature() {
  return apiFetch<{
    timestamp: number;
    signature: string;
    folder: string;
    cloudName: string;
    apiKey: string;
  }>("/api/signature");
}
