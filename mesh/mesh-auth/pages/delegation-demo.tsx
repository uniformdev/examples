import {
  DelegationGate,
  DelegationProvider,
  useDelegationFetch,
  useMeshLocation,
  useUniformMeshSdk,
} from '@uniformdev/mesh-sdk-react';
import { useCallback, useState } from 'react';

import { checkActive, onSessionToken } from '../lib/delegationSessionCallbacks';
import type { CompositionSummary } from './api/composition';

/**
 * BFF fetch with mid-session expiry recovery. `useDelegationFetch` injects the
 * Mesh CSRF header automatically and retries once on `delegation_expired` 401.
 */
function useFetchComposition() {
  const delegationFetch = useDelegationFetch();

  return useCallback(
    async (projectId: string, compositionId: string, state: number): Promise<CompositionSummary> => {
      const params = new URLSearchParams({ projectId, compositionId, state: String(state) });
      const res = await delegationFetch(`/api/composition?${params.toString()}`);
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        let detail = text;
        try {
          detail = (JSON.parse(text) as { error?: string }).error ?? text;
        } catch {
          /* not JSON */
        }
        throw new Error(detail || `Request failed (${res.status})`);
      }
      return res.json() as Promise<CompositionSummary>;
    },
    [delegationFetch]
  );
}

function DelegationDemoContent() {
  const { metadata } = useMeshLocation<'projectTool'>();
  const projectId = metadata.projectId;
  const fetchComposition = useFetchComposition();

  const [compositionId, setCompositionId] = useState('');
  const [result, setResult] = useState<CompositionSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async (state: number) => {
    const id = compositionId.trim();
    if (!id) {
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await fetchComposition(projectId, id, state);
      setResult(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Mesh Auth Demo</h1>
      <p>
        Identity delegation example: the browser exchanges a Mesh session token for a sealed cookie, then
        calls this app&apos;s BFF. The BFF uses the delegation access token to call Uniform Canvas. When the
        access token expires (about 15 minutes), the next BFF call returns <code>delegation_expired</code>;{' '}
        <code>useDelegationFetch</code> re-exchanges a session token and retries (no refresh-token flow in
        this demo).
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="composition-id" style={{ display: 'block', marginBottom: '0.25rem' }}>
          Composition ID
        </label>
        <input
          id="composition-id"
          type="text"
          value={compositionId}
          onChange={(e) => setCompositionId(e.target.value)}
          placeholder="Paste a composition UUID"
          style={{ width: '100%', maxWidth: '28rem', padding: '0.5rem' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button type="button" disabled={!compositionId.trim() || loading} onClick={() => load(0)}>
          Fetch draft
        </button>
        <button type="button" disabled={!compositionId.trim() || loading} onClick={() => load(64)}>
          Fetch published
        </button>
      </div>

      {loading && <p>Loading…</p>}
      {error && <pre style={{ color: 'crimson', whiteSpace: 'pre-wrap' }}>{error}</pre>}
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}

/**
 * Project tool demonstrating the Mesh SDK delegation flow (`DelegationProvider` + BFF routes).
 */
export default function DelegationDemo() {
  const sdk = useUniformMeshSdk();

  return (
    <DelegationProvider sdk={sdk} checkActive={checkActive} onSessionToken={onSessionToken}>
      <DelegationGate>
        <DelegationDemoContent />
      </DelegationGate>
    </DelegationProvider>
  );
}
