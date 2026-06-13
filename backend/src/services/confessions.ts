import { Confession, SearchParams } from "../types/confession.js";
import { toSnakeCase } from "../utils/textFormats.js";
import db from "./db.js";

export async function insertConfession(confession: Confession): Promise<void> {
  const query = `INSERT INTO confessions (content, title, category, NSFW) VALUES ($1, $2, $3, $4)`;

  await db.query(query, [confession.content, confession.title, confession.category, confession.isNSFW]);
}

export async function getConfessions(params: SearchParams): Promise<Confession[]> {
  let query = `SELECT * FROM confessions`;
  const values: unknown[] = [];
  const conditions: string[] = [];

  if (params.content) {
    values.push(`%${params.content}%`);
    conditions.push(`content ILIKE $${values.length}`);
  }

  if (params.category) {
    values.push(params.category);
    conditions.push(`category = $${values.length}`);
  }

  if (params.isNSFW !== undefined) {
    values.push(params.isNSFW);
    conditions.push(`NSFW = $${values.length}`);
  }

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  if (params.orderBy) {
    query += ` ORDER BY ${toSnakeCase(params.orderBy)}`;
    if (params.orderDirection) {
      query += ` ${params.orderDirection.toUpperCase()}`;
    }
  } else {
    query += ` ORDER BY id DESC`;
  }

  const result = await db.query<Confession>(query, values);
  return result.rows;
}

export async function getConfessionById(id: string): Promise<Confession | null> {
  const query = `SELECT * FROM confessions WHERE id = $1`;

  const result = await db.query<Confession>(query, [id]);
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0] as Confession;
}