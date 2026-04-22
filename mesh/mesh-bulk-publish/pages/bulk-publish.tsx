import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Callout, LoadingOverlay } from '@uniformdev/design-system';
import {
  DelegationGate,
  DelegationProvider,
  useMeshLocation,
  useUniformMeshSdk,
} from '@uniformdev/mesh-sdk-react';
import { useEffect, useState } from 'react';

import { checkActive, onSessionToken } from '../lib/delegationSessionCallbacks';
import type { CompositionListItem, CompositionsPageResponse } from './api/compositions';

async function fetchCompositionsPage(projectId: string, offset: number): Promise<CompositionsPageResponse> {
  const params = new URLSearchParams({ projectId, offset: String(offset) });
  const res = await fetch(`/api/compositions?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch compositions (${res.status})`);
  }
  return res.json() as Promise<CompositionsPageResponse>;
}

async function publishCompositions(projectId: string, compositionIds: string[]): Promise<void> {
  const res = await fetch('/api/publish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId, compositionIds }),
  });
  if (!res.ok && res.status !== 207) {
    throw new Error(`Publish failed (${res.status})`);
  }
}

function BulkPublishContent() {
  const { metadata } = useMeshLocation<'projectTool'>();
  const projectId = metadata.projectId;
  const queryClient = useQueryClient();

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pageOffset, setPageOffset] = useState(0);

  useEffect(() => {
    setSelected(new Set());
  }, [pageOffset]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['compositions', projectId, pageOffset],
    queryFn: () => fetchCompositionsPage(projectId, pageOffset),
  });

  const publishMutation = useMutation({
    mutationFn: (ids: string[]) => publishCompositions(projectId, ids),
    onSuccess: () => {
      setSelected(new Set());
      void queryClient.invalidateQueries({ queryKey: ['compositions', projectId] });
    },
  });

  if (isLoading) {
    return <p>Loading compositions…</p>;
  }
  if (error) {
    return <p>Error loading compositions: {(error as Error).message}</p>;
  }

  const page = data;
  const compositions: CompositionListItem[] = page?.items ?? [];
  const pageSize = page?.pageSize ?? 20;
  const hasMore = page?.hasMore ?? false;
  const rangeStart = compositions.length === 0 ? 0 : (page?.offset ?? 0) + 1;
  const rangeEnd = (page?.offset ?? 0) + compositions.length;

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    setSelected(selected.size === compositions.length ? new Set() : new Set(compositions.map((c) => c.id)));
  };

  return (
    <div>
      <h1>Bulk Publish</h1>
      <p>
        {compositions.length === 0
          ? 'No compositions on this page.'
          : `Compositions ${rangeStart}–${rangeEnd} (page size ${pageSize}).`}{' '}
        {selected.size} selected.
      </p>

      <div
        style={{
          marginBottom: '1rem',
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <button
          type="button"
          onClick={() => setPageOffset((o) => Math.max(0, o - pageSize))}
          disabled={pageOffset === 0}
        >
          Previous page
        </button>
        <button type="button" onClick={() => setPageOffset((o) => o + pageSize)} disabled={!hasMore}>
          Next page
        </button>
        <button onClick={toggleAll}>
          {selected.size === compositions.length ? 'Deselect all' : 'Select all'}
        </button>
        <button
          onClick={() => publishMutation.mutate([...selected])}
          disabled={selected.size === 0 || publishMutation.isPending}
        >
          {publishMutation.isPending ? 'Publishing…' : `Publish ${selected.size} selected`}
        </button>
      </div>

      {publishMutation.isError && (
        <p style={{ color: 'red' }}>Publish failed: {(publishMutation.error as Error).message}</p>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ width: '2rem' }} />
            <th style={{ textAlign: 'left' }}>Name</th>
            <th style={{ textAlign: 'left' }}>Type</th>
            <th style={{ textAlign: 'left' }}>State</th>
            <th style={{ textAlign: 'left' }}>Path</th>
          </tr>
        </thead>
        <tbody>
          {compositions.map((c) => (
            <tr key={c.id}>
              <td>
                <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggleSelect(c.id)} />
              </td>
              <td>{c.name}</td>
              <td title={c.componentTypeId}>
                {c.componentTypeIcon ? `${c.componentTypeIcon} ` : ''}
                {c.componentTypeName}
              </td>
              <td>{c.state === 64 ? 'Published' : 'Draft'}</td>
              <td>{c.projectMapPath ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function BulkPublish() {
  const sdk = useUniformMeshSdk();

  return (
    <DelegationProvider sdk={sdk} checkActive={checkActive} onSessionToken={onSessionToken}>
      <DelegationGate
        loadingComponent={<LoadingOverlay isActive={true} statusMessage="Connecting to Uniform..." />}
        disabledComponent={
          <Callout type="caution" title="Feature unavailable">
            This app requires permissions that are not currently enabled. Please contact your Uniform
            administrator to enable identity delegation for this integration.
          </Callout>
        }
        errorComponent={({ error }) => (
          <Callout type="error" title="Connection error">
            <p>Failed to establish a secure connection with Uniform.</p>
            <pre style={{ marginTop: 8, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {error.message}
            </pre>
          </Callout>
        )}
      >
        <BulkPublishContent />
      </DelegationGate>
    </DelegationProvider>
  );
}
