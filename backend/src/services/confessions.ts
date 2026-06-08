import { Confession, SearchParams } from "../types/confession.js";
import db from "./db.js";

export async function insertConfession(confession: Confession): Promise<void> {
  const query = `INSERT INTO confessions (content, title, category, NSFW) VALUES ($1, $2, $3, $4)`;

  await db.query(query, [confession.text, confession.title, confession.category, confession.isNSFW]);
}

export async function getConfessions(params: SearchParams): Promise<Confession[]> {
  let query = `SELECT * FROM confessions`;
  const values: unknown[] = [];

  if (params.text) {
    query += ` WHERE content ILIKE $1`;
    values.push(`%${params.text}%`);
  }

  if (params.category) {
    query += params.text ? ` AND category = $2` : ` WHERE category = $2`;
    values.push(params.category);
  }

  if (params.isNSFW !== undefined) {
    query += params.text || params.category ? ` AND NSFW = $3` : ` WHERE NSFW = $3`;
    values.push(params.isNSFW);
  }

  if (params.orderBy) {
    query += ` ORDER BY ${params.orderBy}`;
    if (params.orderDirection) {
      query += ` ${params.orderDirection.toUpperCase()}`;
    }
  } else {
    query += ` ORDER BY id DESC`;
  }

  const result = await db.query<Confession>(query, values);
  return result.rows as Confession[];
}

export async function getConfessionById(id: string): Promise<Confession | null> {
  const query = `SELECT * FROM confessions WHERE id = $1`;

  const result = await db.query<Confession>(query, [id]);
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0] as Confession;
}