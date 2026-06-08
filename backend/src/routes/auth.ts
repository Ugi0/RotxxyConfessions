import { IncomingMessage, ServerResponse } from "http";
import sendJson from "../utils/sendJson.js";
import { createUser, getUserBySessionId } from "../services/users.js";
import { HelixUsersResponse, TwitchTokenResponse, TwitchUser } from "../types/auth.js";
import { getUserRole, parseCookies } from "../utils/auth.js";

const pendingStates = new Set<string>();

export async function handleAuthCallback(req: IncomingMessage, res: ServerResponse, url: URL): Promise<IncomingMessage | ServerResponse | void> {
  if (url.pathname === "/auth/login") {
    const state = crypto.randomUUID();
    pendingStates.add(state);

    const authUrl = new URL("https://id.twitch.tv/oauth2/authorize");
    authUrl.searchParams.set("client_id", requiredEnv("TWITCH_CLIENT_ID"));
    authUrl.searchParams.set("redirect_uri", requiredEnv("TWITCH_REDIRECT_URI"));
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set(
      "scope",
      "user:read:email"
    );
    authUrl.searchParams.set("state", state);

    res.writeHead(302, { Location: authUrl.toString() });
    return res.end();
  }

  if (url.pathname.startsWith("/auth/callback")) {
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code || !state) {
      return sendJson(res, 400, { error: "Missing code or state" });
    }

    if (!pendingStates.has(state)) {
      return sendJson(res, 400, { error: "Invalid OAuth state" });
    }

    pendingStates.delete(state);

    const tokenData: TwitchTokenResponse = await exchangeCodeForToken(code);

    const userData: TwitchUser = await getUserProfile(tokenData.access_token);

    if (!userData) {
      return sendJson(res, 500, { error: "Failed to fetch user profile" });
    }

    const role = getUserRole(userData.login);

    if (role == "user") {
        return sendJson(res, 403, { error: "Access denied" });
    }

    const sessionId = crypto.randomUUID();
    console.log("User authenticated:", userData.login, "Session ID:", sessionId);

    await createUser(userData.id, userData.display_name, role, sessionId);

    res.setHeader("Set-Cookie", [
      `user_session_id=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax;} max-age=${6 * 30 * 24 * 60 * 60}`,
    ]);

    const redirectUrl = role === "streamer" ? "/streamer" : "/moderator";
    res.writeHead(302, { Location: redirectUrl });
    return res.end();
  }

  if (url.pathname.startsWith("/auth/validate")) {
    const cookies = parseCookies(req);
    const sessionId = cookies.user_session_id;

    if (!sessionId) {
      return sendJson(res, 401, { error: "Unauthorized" });
    }

    const user = await getUserBySessionId(sessionId);
    if (!user) {
      return sendJson(res, 401, { error: "Unauthorized" });
    }

    return sendJson(res, 200, { role: user.role });
  }

  sendJson(res, 404, { error: "Not found" });
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} environment variable is not set`);
  }
  return value;
}

async function getUserProfile(
  accessToken: string
): Promise<TwitchUser> {
  const resp = await fetch("https://api.twitch.tv/helix/users", {
    headers: {
      "Client-ID": process.env.TWITCH_CLIENT_ID!,
      "Authorization": `Bearer ${accessToken}`,
    },
  });

  if (!resp.ok) {
    throw new Error(`User profile failed: ${resp.status}`);
  }

  const json = (await resp.json()) as HelixUsersResponse;
  return json.data?.[0] ?? null;
}

export async function exchangeCodeForToken(
  code: string
): Promise<TwitchTokenResponse> {
  const resp = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.TWITCH_CLIENT_ID!,
      client_secret: process.env.TWITCH_CLIENT_SECRET!,
      code,
      grant_type: "authorization_code",
      redirect_uri: process.env.TWITCH_REDIRECT_URI!,
    }),
  });

  if (!resp.ok) {
    throw new Error(`Exchange code failed: ${resp.status}`);
  }

  return resp.json();
}