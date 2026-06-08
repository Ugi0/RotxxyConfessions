import { Request, Response } from "express";
import { getConfessions } from "../services/confessions.js";
import { SearchParams } from "../types/confession.js";

export default async function handleConfessionsRoute(req: Request, res: Response): Promise<void> {
    const searchParams = req.query as SearchParams;

    const confessions = await getConfessions(searchParams);
    res.status(200).json(confessions);
}