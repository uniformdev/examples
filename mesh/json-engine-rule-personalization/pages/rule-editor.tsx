import { Button, useMeshLocation } from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';

// The stored value points the variant at a segment created from an uploaded CSV
// of customer IDs. Only `segmentId` is the runtime contract — the consuming app
// resolves membership by looking that id up in storage (SQLite mock today,
// Cloudflare D1 later). The remaining fields are display metadata for the editor.
// `crit` is platform-managed: the default selection-algorithm initializer seeds a
// stale `crit` that fails the publish-time dimension validator, so we always clear
// it (our algorithm reads `segmentId`, not `crit`).
type SegmentCriteria = {
  segmentId?: string;
  segmentName?: string;
  rowCount?: number;
  sourceFilename?: string;
  uploadedAt?: string;
  crit?: unknown[];
};

type SegmentResponse = {
  id: string;
  name: string;
  rowCount: number;
  sourceFilename: string | null;
  createdAt: string;
  error?: string;
};

const RuleEditor: NextPage = () => {
  const { value, setValue, isReadOnly } = useMeshLocation<'personalizationCriteria', SegmentCriteria>(
    'personalizationCriteria'
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // Clear the platform's seeded `crit` once on mount so a freshly-personalized
  // variant (no segment yet) can still be published.
  useEffect(() => {
    if (!isReadOnly && Array.isArray(value?.crit) && value!.crit!.length > 0) {
      setValue((previous) => ({ newValue: { ...(previous ?? {}), crit: [] } }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasSegment = Boolean(value?.segmentId);

  const uploadCsv = async (file: File) => {
    setIsUploading(true);
    setError(undefined);
    try {
      const csv = await file.text();
      const res = await fetch('/api/segments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv, sourceFilename: file.name }),
      });
      const data = (await res.json()) as SegmentResponse;
      if (!res.ok) throw new Error(data.error ?? 'Upload failed.');

      setValue(() => ({
        newValue: {
          crit: [],
          segmentId: data.id,
          segmentName: data.name,
          rowCount: data.rowCount,
          sourceFilename: data.sourceFilename ?? undefined,
          uploadedAt: data.createdAt,
        },
      }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) void uploadCsv(file);
  };

  const removeSegment = () => {
    setError(undefined);
    setValue(() => ({ newValue: { crit: [] } }));
  };

  return (
    <div>
      <h2>Segment targeting</h2>

      {hasSegment ? (
        <p>
          This variant matches visitors whose customer ID is in the uploaded segment.
        </p>
      ) : (
        <p>
          <strong>Default variant.</strong> No segment uploaded — this variant always matches.
          Place it last in the variant list so it is selected only when no other variant&apos;s
          segment matches. Upload a CSV below to target a specific audience.
        </p>
      )}

      {hasSegment && (
        <div style={{ padding: '12px 16px', background: '#f5f5f5', borderRadius: 4, marginBottom: 12 }}>
          <div><strong>{value!.segmentName}</strong></div>
          <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>
            {value!.rowCount ?? 0} customer IDs
            {value!.sourceFilename ? ` · ${value!.sourceFilename}` : ''}
          </div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
            Segment ID: <code>{value!.segmentId}</code>
          </div>
        </div>
      )}

      {!isReadOnly && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          style={{
            border: `2px dashed ${isDragging ? '#2b6cb0' : '#cbd5e0'}`,
            borderRadius: 6,
            padding: '28px 16px',
            textAlign: 'center',
            cursor: 'pointer',
            background: isDragging ? '#ebf4ff' : '#fafafa',
            color: '#555',
          }}
        >
          {isUploading
            ? 'Uploading…'
            : hasSegment
              ? 'Drag a new CSV here (or click) to replace the segment'
              : 'Drag a customer-ID CSV here, or click to choose a file'}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            style={{ display: 'none' }}
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = '';
            }}
          />
        </div>
      )}

      {error && <p style={{ color: '#c53030', marginTop: 12 }}>{error}</p>}

      {hasSegment && !isReadOnly && (
        <div style={{ marginTop: 12 }}>
          <Button type="button" buttonType="secondary" onClick={removeSegment}>
            Remove segment
          </Button>
        </div>
      )}
    </div>
  );
};

export default RuleEditor;
