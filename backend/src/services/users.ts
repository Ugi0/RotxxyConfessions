import { User } from "../types/user.js";
import db from "./db.js";

export async function createUser(twitchId: string, username: string, profileImageUrl: string, role: "user" | "moderator" | "streamer", sessionId: string): Promise<void> {
    const query = `
    INSERT INTO users 
        (twitch_id, username, profileimageurl, role, session_id) 
        VALUES ($1, $2, $3, $4, $5) 
    ON CONFLICT (twitch_id) 
        DO UPDATE SET
            username = EXCLUDED.username,
            profileimageurl = EXCLUDED.profileimageurl,
            role = EXCLUDED.role,
            session_id = EXCLUDED.session_id
        WHERE users.username IS DISTINCT FROM EXCLUDED.username
            OR users.profileimageurl IS DISTINCT FROM EXCLUDED.profileimageurl
            OR users.role IS DISTINCT FROM EXCLUDED.role
            OR users.session_id IS DISTINCT FROM EXCLUDED.session_id;
    `;

    await db.query(query, [twitchId, username, profileImageUrl, role, sessionId]);
}

export async function getUserBySessionId(sessionId: string): Promise<User | null> {
    const query = `
        SELECT 
            id,
            session_id AS "sessionId",
            twitch_id AS "twitchId",
            username,
            role,
            created_at AS "createdAt",
            profileimageurl AS "profileImageUrl"
        FROM users 
        WHERE session_id = $1
    `;

    const result = await db.query(query, [sessionId]);
    if (result.rows.length === 0) {
        return null;
    }
    return result.rows[0] as User;
}

export async function removeUserSession(sessionId: string): Promise<void> {
    const query = `UPDATE users SET session_id = NULL WHERE session_id = $1`;
    await db.query(query, [sessionId]);
}