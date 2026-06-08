import db from "./db.js";

export async function insertSession(sessionId: string): Promise<void> {
    const query = `INSERT INTO sessions (session_id) VALUES ($1)`;

    await db.query(query, [sessionId]);
}

export async function checkValidSession(sessionId: string): Promise<boolean> {
    const query = `SELECT * FROM sessions WHERE session_id = $1 AND expires_at > NOW()`;

    const result = await db.query(query, [sessionId]);
    return result.rows.length > 0;
}

export async function deleteSession(sessionId: string): Promise<void> {
    const query = `DELETE FROM sessions WHERE session_id = $1`;

    await db.query(query, [sessionId]);
}