import { Request, Response } from "express";
import { generateSessionId } from "../utils/auth.js";
import { checkValidSession, deleteSession, insertSession } from "../services/sessions.js";
import { Confession } from "../types/confession.js";
import { insertConfession } from "../services/confessions.js";

export async function handleConfessionRoute(req: Request, res: Response): Promise<void> {
  if (req.method === "GET") {
    const sessionId = generateSessionId();

    res.cookie("session_id", sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    await insertSession(sessionId);

    res.status(200).json({ sessionId });
    return;
  }

  if (req.method === "POST") {
    const sessionId = req.cookies?.session_id;

    if (!sessionId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const isValidSession = await checkValidSession(sessionId);

    if (!isValidSession) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const confessionData = req.body as Confession;

    if (!confessionData?.text) {
      res.status(400).json({ error: "Confession text is required" });
      return;
    }

    await insertConfession(confessionData);
    await deleteSession(sessionId);

    res
      .status(201)
      .json({ message: "Confession submitted successfully" });
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}