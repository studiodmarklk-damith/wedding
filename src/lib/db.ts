import { getCloudflareContext } from "@opennextjs/cloudflare";
import { DEFAULT_SETTINGS, normalizeSettings, SETTINGS_KEYS, toRecord, Settings } from "./settings";

/** Minimal structural type for the D1 binding (avoids needing @cloudflare/workers-types). */
interface Stmt {
  bind(...values: unknown[]): Stmt;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
}
interface D1Like {
  prepare(query: string): Stmt;
  batch(statements: Stmt[]): Promise<unknown>;
}

function getDB(): D1Like | null {
  try {
    const { env } = getCloudflareContext();
    const db = (env as unknown as Record<string, unknown>).DB as D1Like | undefined;
    return db ?? null;
  } catch {
    return null; // e.g. during a plain build without Cloudflare context
  }
}

export async function getSettings(): Promise<Settings> {
  const db = getDB();
  if (!db) return DEFAULT_SETTINGS;
  try {
    const { results } = await db.prepare("SELECT key, value FROM settings").all<{ key: string; value: string }>();
    const map: Record<string, string> = {};
    for (const row of results) map[row.key] = row.value;
    return normalizeSettings(map);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(input: Record<string, unknown>): Promise<Settings> {
  const db = getDB();
  const clean = normalizeSettings(input);
  const rec = toRecord(clean);
  if (!db) return clean;
  const statements = SETTINGS_KEYS.map((key) => db.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT (key) DO UPDATE SET value = excluded.value").bind(key, rec[key]));
  await db.batch(statements);
  return clean;
}

export async function getVisits(): Promise<number> {
  const db = getDB();
  if (!db) return 0;
  try {
    const row = await db.prepare("SELECT count FROM visits WHERE id = 1").first<{ count: number }>();
    return row?.count ?? 0;
  } catch {
    return 0;
  }
}

export async function addVisit(): Promise<number> {
  const db = getDB();
  if (!db) return 0;
  try {
    await db
      .prepare("UPDATE visits SET count = count + 1, updated_at = ? WHERE id = 1")
      .bind(new Date().toISOString())
      .run();
    return await getVisits();
  } catch {
    return 0;
  }
}
