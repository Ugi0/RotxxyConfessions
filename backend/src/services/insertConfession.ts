import { Confession } from "../types/confession.js";
import db from "./db.js";

export async function insertConfession(confession: Confession): Promise<void> {
  const query = `INSERT INTO confessions (content, title, category, NSFW) VALUES ($1, $2, $3, $4)`;

  await db.query(query, [confession.text, confession.title, confession.category, confession.isNSFW]);
}