import { User } from "../types/user.js";
import db from "./db.js";

export async function createUser(twitchId: string, username: string, role: "user" | "moderator" | "streamer", sessionId: string): Promise<void> {
    const query = `INSERT INTO users (twitch_id, username, role, session_id) VALUES ($1, $2, $3, $4) ON CONFLICT (twitch_id) DO UPDATE SET session_id = EXCLUDED.session_id`;

    await db.query(query, [twitchId, username, role, sessionId]);
}

export async function getUserBySessionId(sessionId: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE session_id = $1`;

    const result = await db.query(query, [sessionId]);
    if (result.rows.length === 0) {
        return null;
    }
    return result.rows[0] as User;
}