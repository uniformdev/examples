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

let store: SegmentStore | undefined;

export function getSegmentStore(): SegmentStore {
  if (!store) store = new SqliteSegmentStore();
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
