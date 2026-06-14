import { Request, Response } from "express";
import { getConfessionById, getConfessions, updateConfessionStatus } from "../services/confessions.js";
import { SearchParams } from "../types/confession.js";

export default async function handleConfessionsRoute(req: Request, res: Response): Promise<void> {
    const searchParams = req.query as SearchParams;

    const confessions = await getConfessions(searchParams);
    res.status(200).json(confessions);
}

export async function handleUpdateConfessionStatus(req: Request, res: Response) {
  const { id, action } = req.params as { id: string; action: string };

  console.log("ID:", id);
  console.log("Action:", action);

  if (!id || !action) {
    res.status(400).json({ error: "Missing id or action" });
    return;
  }

  getConfessionById(id).then(async confession => {
    if (!confession) {
      res.status(404).json({ error: "Confession not found" });
      return;
    }

    let isReviewed = confession.isReviewed;
    let isApproved = confession.isApproved;
    let isViewed = confession.isViewed;

    if (action === "approve") {
      isReviewed = true;
      isApproved = true;
    } else if (action === "reject") {
      isReviewed = true;
      isApproved = false;
    } else if (action === "rereview") {
      isReviewed = false;
      isApproved = false;
    } else {
      res.status(400).json({ error: "Invalid action" });
      return;
    }

    await updateConfessionStatus(id, isReviewed, isApproved, isViewed).then(() => {
      res.status(200).json({ message: "Confession status updated successfully" });
    }).catch(err => {
      console.error("Error updating confession status:", err);
      res.status(500).json({ error: "Failed to update confession status" });
    });
  })
}
