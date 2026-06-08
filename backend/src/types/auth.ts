import { IncomingMessage } from "node:http";

export function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function parseCookies(req: IncomingMessage): Record<string, string> {
  const header = req.headers.cookie;
  if (!header) return {};

  return Object.fromEntries(
    header.split("; ").map(cookie => {
      const index = cookie.indexOf("=");
      const name = cookie.substring(0, index);
      const value = cookie.substring(index + 1);
      return [name, decodeURIComponent(value)];
    })
  );
}