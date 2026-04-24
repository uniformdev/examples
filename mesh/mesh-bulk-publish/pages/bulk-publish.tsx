import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CANVAS_PUBLISHED_STATE } from '@uniformdev/canvas';
import {
  DelegationGate,
  DelegationProvider,
  useMeshLocation,
  useUniformMeshSdk,
} from '@uniformdev/mesh-sdk-react';
import { useEffect, useState } from 'react';

const SEARCH_DEBOUNCE_MS = 350;

import { CSRF_HEADER_NAME, CSRF_HEADER_VALUE } from '../lib/csrf';
import { checkActive, onSessionToken } from '../lib/delegationSessionCallbacks';
import type { CompositionListItem, CompositionsPageResponse } from './api/compositions';

async function fetchCompositionsPage(
  projectId: string,
  offset: number,
  keyword: string
): Promise<CompositionsPageResponse> {
  const params = new URLSearchParams({ projectId, offset: String(offset) });
  if (keyword.length > 0) {
    params.set('keyword', keyword);
  }
  const res = await fetch(`/api/compositions?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch compositions (${res.status}): ${await res.text()}`);
  }
  return res.json() as Promise<CompositionsPageResponse>;
}

async function publishCompositions(projectId: string, compositionIds: string[]): Promise<void> {
  const res = await fetch('/api/publish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      [CSRF_HEADER_NAME]: CSRF_HEADER_VALUE,
    },
    body: JSON.stringify({ projectId, compositionIds }),
  });
  if (!res.ok) {
    throw new Error(`Publish failed (${res.status}): ${await res.text()}`);
  }
}

function BulkPublishContent() {
  const { metadata } = useMeshLocation<'projectTool'>();
  const projectId = metadata.projectId;
  const queryClient = useQueryClient();

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pageOffset, setPageOffset] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const next = searchInput.trim();
      setDebouncedKeyword((prev) => {
        if (prev !== next) {
          setPageOffset(0);
        }
        return next;
      });
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      window.clearTimeout(handle);
    };
  }, [searchInput]);

  useEffect(() => {
    setSelected(new Set());
  }, [pageOffset, debouncedKeyword]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['compositions', projectId, pageOffset, debouncedKeyword],
    queryFn: () => fetchCompositionsPage(projectId, pageOffset, debouncedKeyword),
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
  const publishable = compositions.filter((c) => c.state !== CANVAS_PUBLISHED_STATE);

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
    setSelected(selected.size === publishable.length ? new Set() : new Set(publishable.map((c) => c.id)));
  };

  return (
    <div>
      <h1>Bulk Publish</h1>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="composition-search" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>
          Search compositions
        </label>
        <input
          id="composition-search"
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Matches name, slug, or definition name…"
          autoComplete="off"
          style={{ width: '100%', maxWidth: '28rem', padding: '0.5rem 0.6rem', boxSizing: 'border-box' }}
        />
      </div>
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
        <button onClick={toggleAll} disabled={publishable.length === 0}>
          {selected.size === publishable.length && publishable.length > 0 ? 'Deselect all' : 'Select all'}
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
          {compositions.map((c) => {
            const isPublished = c.state === CANVAS_PUBLISHED_STATE;
            return (
              <tr key={c.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.has(c.id)}
                    disabled={isPublished}
                    onChange={() => toggleSelect(c.id)}
                  />
                </td>
                <td>{c.name}</td>
                <td title={c.componentTypeId}>
                  {c.componentTypeIcon ? `${c.componentTypeIcon} ` : ''}
                  {c.componentTypeName}
                </td>
                <td>{isPublished ? 'Published' : 'Draft'}</td>
                <td>{c.projectMapPath ?? '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function BulkPublish() {
  const sdk = useUniformMeshSdk();

  return (
    <DelegationProvider sdk={sdk} checkActive={checkActive} onSessionToken={onSessionToken}>
      <DelegationGate>
        <BulkPublishContent />
      </DelegationGate>
    </DelegationProvider>
  );
}
