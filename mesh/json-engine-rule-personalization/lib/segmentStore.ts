import { randomUUID } from 'crypto';
import { mkdirSync } from 'fs';
import path from 'path';

import Database from 'better-sqlite3';

// A personalization "segment" is the audience produced by uploading a CSV of
// customer IDs in the rule editor. Each upload becomes exactly one row, and the
// generated `id` is what gets stored on the variant's criteria — the runtime app
// later looks the segment up by this id to decide membership.
export type SegmentRecord = {
  id: string;
  name: string;
  sourceFilename: string | null;
  customerIds: string[];
  rowCount: number;
  createdAt: string;
};

export type CreateSegmentInput = {
  name: string;
  customerIds: string[];
  sourceFilename?: string | null;
};

// Async interface so the SQLite mock and the real Cloudflare D1 implementation
// are interchangeable — D1's API is promise-based, so callers already await.
export interface SegmentStore {
  createSegment(input: CreateSegmentInput): Promise<SegmentRecord>;
  getSegment(id: string): Promise<SegmentRecord | null>;
}

type SegmentRow = {
  id: string;
  name: string;
  source_filename: string | null;
  customer_ids: string;
  row_count: number;
  created_at: string;
};

function rowToRecord(row: SegmentRow): SegmentRecord {
  return {
    id: row.id,
    name: row.name,
    sourceFilename: row.source_filename,
    customerIds: JSON.parse(row.customer_ids) as string[],
    rowCount: row.row_count,
    createdAt: row.created_at,
  };
}

// ---------------------------------------------------------------------------
// Local SQLite mock of Cloudflare D1.
//
// To swap in real D1: implement `SegmentStore` against the D1 binding (the SQL
// is identical — D1 is SQLite). e.g. `env.DB.prepare(sql).bind(...).run()` /
// `.first()`. Keep this file's interface and the `segments` table shape and the
// rest of the app (API route + editor) needs no changes.
// ---------------------------------------------------------------------------

const DB_PATH = process.env.SEGMENTS_DB_PATH ?? path.join(process.cwd(), '.data', 'segments.sqlite');

// Reuse a single connection across hot reloads in dev rather than reopening the
// file on every request.
declare global {
  // eslint-disable-next-line no-var
  var __segmentsDb: Database.Database | undefined;
}

function getDb(): Database.Database {
  if (global.__segmentsDb) return global.__segmentsDb;

  mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS segments (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      source_filename TEXT,
      customer_ids TEXT NOT NULL,
      row_count INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  global.__segmentsDb = db;
  return db;
}

class SqliteSegmentStore implements SegmentStore {
  async createSegment(input: CreateSegmentInput): Promise<SegmentRecord> {
    const record: SegmentRecord = {
      id: `seg_${randomUUID()}`,
      name: input.name,
      sourceFilename: input.sourceFilename ?? null,
      customerIds: input.customerIds,
      rowCount: input.customerIds.length,
      createdAt: new Date().toISOString(),
    };

    getDb()
      .prepare(
        `INSERT INTO segments (id, name, source_filename, customer_ids, row_count, created_at)
         VALUES (@id, @name, @sourceFilename, @customerIds, @rowCount, @createdAt)`
      )
      .run({
        id: record.id,
        name: record.name,
        sourceFilename: record.sourceFilename,
        customerIds: JSON.stringify(record.customerIds),
        rowCount: record.rowCount,
        createdAt: record.createdAt,
      });

    return record;
  }

  async getSegment(id: string): Promise<SegmentRecord | null> {
    const row = getDb().prepare(`SELECT * FROM segments WHERE id = ?`).get(id) as SegmentRow | undefined;
    return row ? rowToRecord(row) : null;
  }
}

// ---------------------------------------------------------------------------
// Cloudflare D1 (via the REST query API).
//
// Used automatically when CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID, and
// CLOUDFLARE_API_TOKEN are all set. The `segments` table shape is identical to
// the SQLite mock (D1 is SQLite), so the API route and editor are unchanged.
// The table is created lazily on first write, mirroring the mock.
// ---------------------------------------------------------------------------

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS segments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    source_filename TEXT,
    customer_ids TEXT NOT NULL,
    row_count INTEGER NOT NULL,
    created_at TEXT NOT NULL
  );
`;

type D1Config = { accountId: string; databaseId: string; apiToken: string };

function getD1Config(): D1Config | null {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (accountId && databaseId && apiToken) return { accountId, databaseId, apiToken };
  return null;
}

class D1SegmentStore implements SegmentStore {
  private tableReady = false;

  constructor(private readonly config: D1Config) {}

  // Returns the rows of the first (only) statement in the query.
  private async query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
    const { accountId, databaseId, apiToken } = this.config;
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql, params }),
      }
    );

    const body = (await res.json()) as {
      success: boolean;
      errors?: { message: string }[];
      result?: { results: T[]; success: boolean }[];
    };

    if (!res.ok || !body.success) {
      const message = body.errors?.map((e) => e.message).join('; ') || `D1 request failed (${res.status})`;
      throw new Error(message);
    }

    return body.result?.[0]?.results ?? [];
  }

  private async ensureTable(): Promise<void> {
    if (this.tableReady) return;
    await this.query(CREATE_TABLE_SQL);
    this.tableReady = true;
  }

  async createSegment(input: CreateSegmentInput): Promise<SegmentRecord> {
    await this.ensureTable();

    const record: SegmentRecord = {
      id: `seg_${randomUUID()}`,
      name: input.name,
      sourceFilename: input.sourceFilename ?? null,
      customerIds: input.customerIds,
      rowCount: input.customerIds.length,
      createdAt: new Date().toISOString(),
    };

    await this.query(
      `INSERT INTO segments (id, name, source_filename, customer_ids, row_count, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        record.id,
        record.name,
        record.sourceFilename,
        JSON.stringify(record.customerIds),
        record.rowCount,
        record.createdAt,
      ]
    );

    return record;
  }

  async getSegment(id: string): Promise<SegmentRecord | null> {
    await this.ensureTable();
    const rows = await this.query<SegmentRow>(`SELECT * FROM segments WHERE id = ?`, [id]);
    return rows[0] ? rowToRecord(rows[0]) : null;
  }
}

let store: SegmentStore | undefined;

export function getSegmentStore(): SegmentStore {
  if (store) return store;

  const d1Config = getD1Config();
  if (d1Config) {
    console.info('[alex] segmentStore: using Cloudflare D1 backend');
    store = new D1SegmentStore(d1Config);
  } else {
    console.info('[alex] segmentStore: using local SQLite mock (set CLOUDFLARE_* env vars to use D1)');
    store = new SqliteSegmentStore();
  }
  return store;
}

// Parses a single-column customer-ID CSV (the first cell of each line). The
// header row (e.g. "CUSTOMERIDS") is dropped when it contains no digits.
// Duplicates are removed while preserving order.
export function parseCustomerIdsCsv(csv: string): string[] {
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.split(',')[0]?.trim() ?? '')
    .filter(Boolean);

  if (lines.length > 0 && !/\d/.test(lines[0])) {
    lines.shift();
  }

  return Array.from(new Set(lines));
}
