import { setAuthTokenGetter } from "@workspace/api-client-react";

const TOKEN_KEY = "frociarola_admin_token";

export function getAdminToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    window.dispatchEvent(new Event("admin-auth-changed"));
  } catch {
    // ignore
  }
}

export function clearAdminToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event("admin-auth-changed"));
  } catch {
    // ignore
  }
}

export function isAdminLoggedIn(): boolean {
  return !!getAdminToken();
}

let configured = false;
export function configureAdminAuth(): void {
  if (configured) return;
  configured = true;
  setAuthTokenGetter(() => getAdminToken());
}
