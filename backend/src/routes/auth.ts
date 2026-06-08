import { Request, Response } from "express";
import { IncomingMessage, ServerResponse } from "http";
import { createUser, getUserBySessionId } from "../services/users.js";
import { HelixUsersResponse, TwitchTokenResponse, TwitchUser } from "../types/auth.js";
import { getUserRole } from "../utils/auth.js";

const pendingStates = new Set<string>();

export async function handleValidation(req: Request, res: Response): Promise<void> {
  const sessionId = req.cookies?.user_session_id;

  if (!sessionId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const user = await getUserBySessionId(sessionId);

  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  res.status(200).json({ role: user.role });
}


export async function handleCallback(req: Request, res: Response): Promise<IncomingMessage | ServerResponse | void> {
    const { code, state } = req.query as {
        code?: string;
        state?: string;
    };

    if (!code || !state) {
      return res.status(400).json({ error: "Missing code or state" });
    }

    if (!pendingStates.has(state)) {
      return res.status(400).json({ error: "Invalid OAuth state" });
    }

    pendingStates.delete(state);

    const tokenData: TwitchTokenResponse = await exchangeCodeForToken(code);

    const userData: TwitchUser = await getUserProfile(tokenData.access_token);

    if (!userData) {
      return res.status(500).json({ error: "Failed to fetch user profile" });
    }

    const role = getUserRole(userData.login);

    if (role == "user") {
        return res.status(403).json({ error: "Access denied" });
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

export async function handleLogin(req: Request, res: Response): Promise<void> {
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

    res.redirect(authUrl.toString());
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