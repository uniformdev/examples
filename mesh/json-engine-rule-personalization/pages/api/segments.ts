import type { NextApiRequest, NextApiResponse } from 'next';

import { getSegmentStore, parseCustomerIdsCsv, type SegmentRecord } from '../../lib/segmentStore';

type ErrorResponse = { error: string };

// Create a segment from an uploaded CSV (POST) or read one back by id (GET).
// The store is the local SQLite mock today; swap it for Cloudflare D1 without
// touching this handler (see lib/segmentStore.ts).
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SegmentRecord | ErrorResponse>
) {
  const store = getSegmentStore();

  if (req.method === 'GET') {
    const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
    if (!id) return res.status(400).json({ error: 'Missing segment id.' });

    const segment = await store.getSegment(id);
    if (!segment) return res.status(404).json({ error: 'Segment not found.' });
    return res.status(200).json(segment);
  }

  if (req.method === 'POST') {
    const { csv, name, sourceFilename } = (req.body ?? {}) as {
      csv?: string;
      name?: string;
      sourceFilename?: string;
    };

    if (typeof csv !== 'string' || csv.trim().length === 0) {
      return res.status(400).json({ error: 'Request body must include CSV content.' });
    }

    const customerIds = parseCustomerIdsCsv(csv);
    if (customerIds.length === 0) {
      return res.status(400).json({ error: 'No customer IDs found in the uploaded file.' });
    }

    const segment = await store.createSegment({
      name: name?.trim() || sourceFilename?.trim() || 'Customer segment',
      customerIds,
      sourceFilename: sourceFilename ?? null,
    });

    return res.status(201).json(segment);
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
}
