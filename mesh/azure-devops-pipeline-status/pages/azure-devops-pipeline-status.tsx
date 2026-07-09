import { Button, FlexiCard, FlexiCardTitle, Input, VerticalRhythm } from '@uniformdev/design-system';
import { LoadingIndicator, useMeshLocation } from '@uniformdev/mesh-sdk-react';
import { useCallback, useEffect, useState } from 'react';

// Types for Azure DevOps API responses
interface PipelineRun {
  id: number;
  name: string;
  state: 'inProgress' | 'completed' | 'canceling' | 'postponed' | 'queued';
  result?: 'succeeded' | 'failed' | 'canceled' | 'partiallySucceeded' | 'skipped';
  createdDate: string;
  finishedDate?: string;
  pipeline: {
    id: number;
    name: string;
  };
  _links: {
    web: {
      href: string;
    };
  };
}

interface PipelineRunsResponse {
  count: number;
  value: PipelineRun[];
}

interface PipelineRunDetails extends PipelineRun {
  yamlDetails?: {
    rootYamlFile: {
      ref: string;
      yamlFile: string;
      repoAlias: string;
    };
  };
}

// Status icon mapping
const getStatusIcon = (state: string, result?: string): string => {
  if (state === 'inProgress') {
    return '🔄'; // Spinning circle
  }
  if (state === 'completed') {
    if (result === 'succeeded') {
      return '✅'; // Checkmark
    }
    if (result === 'failed') {
      return '❌'; // X mark
    }
    if (result === 'canceled') {
      return '⏹️'; // Stop sign
    }
    if (result === 'partiallySucceeded') {
      return '⚠️'; // Warning
    }
  }
  if (state === 'canceling') {
    return '⏹️'; // Stop sign
  }
  if (state === 'queued') {
    return '⏳'; // Hourglass
  }
  return '❓'; // Unknown
};

const getStatusText = (state: string, result?: string): string => {
  if (state === 'inProgress') {
    return 'In Progress';
  }
  if (state === 'completed') {
    return result ? result.charAt(0).toUpperCase() + result.slice(1) : 'Completed';
  }
  return state.charAt(0).toUpperCase() + state.slice(1);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

interface Config {
  organization: string;
  project: string;
  pipelineId: string;
  authorization: string;
  /** Full URL to the revalidation Function's /api/pending endpoint, incl. ?code=. Optional. */
  pendingFunctionUrl: string;
}

// Shape of the revalidation Function's GET /api/pending response (subset we use).
interface PendingItem {
  path: string;
  kind?: 'composition' | 'entry';
  id?: string;
}

interface PendingResponse {
  items?: PendingItem[];
  dirty?: string[];
}

// Platform path for a pending item's content. No `/projects/<id>` prefix — the
// SDK's router.navigatePlatform prepends the current project automatically.
// Returns null when the route has no single editable entity (path-only).
const platformPathFor = (item: PendingItem): string | null => {
  if (!item.id) return null;
  if (item.kind === 'composition') return `/dashboards/canvas/edit/${item.id}`;
  if (item.kind === 'entry') return `/dashboards/canvas/entries/${item.id}`;
  return null;
};

const CONFIG_STORAGE_KEY = 'azure-devops-pipeline-config';

const AzureDevOpsPipelineStatus = () => {
  // `metadata.projectId` is the current Uniform project; `router.navigatePlatform`
  // opens platform pages scoped to it (prepends /projects/<id> automatically).
  const { metadata, router } = useMeshLocation('canvasEditorTools');

  // Load configuration from localStorage
  const loadConfig = (): Config | null => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  };

  const [config, setConfig] = useState<Config | null>(loadConfig());
  const [showConfig, setShowConfig] = useState(!config);
  const [tempConfig, setTempConfig] = useState<Config>({
    organization: config?.organization || '',
    project: config?.project || '',
    pipelineId: config?.pipelineId || '',
    authorization: config?.authorization || '',
    pendingFunctionUrl: config?.pendingFunctionUrl || '',
  });

  const [runs, setRuns] = useState<PipelineRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pending changes (next deploy), from the revalidation Function.
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [pendingError, setPendingError] = useState<string | null>(null);

  const saveConfig = (newConfig: Config) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
    }
    setConfig(newConfig);
    setShowConfig(false);
  };

  const fetchPipelineRuns = useCallback(
    async (isInitialLoad = false) => {
      if (!config?.organization || !config?.project || !config?.pipelineId || !config?.authorization) {
        setError('Please configure organization, project, pipeline ID, and authorization');
        setLoading(false);
        setShowConfig(true);
        return;
      }

      if (isInitialLoad) {
        setLoading(true);
      }

      try {
        const url = `https://dev.azure.com/${config.organization}/${config.project}/_apis/pipelines/${config.pipelineId}/runs?api-version=7.1`;
        const response = await fetch(url, {
          headers: {
            Authorization: config.authorization,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch pipeline runs: ${response.statusText}`);
        }

        const data: PipelineRunsResponse = await response.json();

        // Separate runs by status
        const inProgressRuns = data.value.filter(run => run.state === 'inProgress');
        const completedRuns = data.value
          .filter(run => run.state === 'completed' && (run.result === 'succeeded' || run.result === 'failed'))
          .sort((a, b) => {
            const dateA = new Date(a.finishedDate || a.createdDate).getTime();
            const dateB = new Date(b.finishedDate || b.createdDate).getTime();
            return dateB - dateA; // Most recent first
          })
          .slice(0, 10); // Get top 10

        // Combine: all in-progress + 10 recent completed/failed
        setRuns([...inProgressRuns, ...completedRuns]);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch pipeline runs');
      } finally {
        setLoading(false);
      }
    },
    [config?.organization, config?.project, config?.pipelineId, config?.authorization]
  );

  const fetchPending = useCallback(async () => {
    if (!config?.pendingFunctionUrl) {
      setPendingItems([]);
      setPendingError(null);
      return;
    }
    try {
      const response = await fetch(config.pendingFunctionUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch pending changes: ${response.statusText}`);
      }
      const data: PendingResponse = await response.json();
      // Prefer attributed `items`; fall back to bare `dirty` paths.
      const items: PendingItem[] = data.items ?? (data.dirty ?? []).map(path => ({ path }));
      setPendingItems(items);
      setPendingError(null);
    } catch (err) {
      setPendingError(err instanceof Error ? err.message : 'Failed to fetch pending changes');
    }
  }, [config?.pendingFunctionUrl]);

  // Update tempConfig when config changes and form is shown
  useEffect(() => {
    if (showConfig && config) {
      setTempConfig({
        organization: config.organization,
        project: config.project,
        pipelineId: config.pipelineId,
        authorization: config.authorization,
        pendingFunctionUrl: config.pendingFunctionUrl || '',
      });
    }
  }, [showConfig, config]);

  // Set loading to false if no config (so we can show the config form)
  useEffect(() => {
    if (!config) {
      setLoading(false);
    }
  }, [config]);

  // Load once when the page opens (and whenever the config changes). Refresh is
  // manual via the Refresh button — no interval polling.
  useEffect(() => {
    if (config) {
      fetchPipelineRuns(true);
      fetchPending();
    }
  }, [fetchPipelineRuns, fetchPending, config]);

  const handleRefresh = () => {
    fetchPipelineRuns(true);
    fetchPending();
  };

  if (loading && runs.length === 0 && !showConfig) {
    return (
      <FlexiCard>
        <FlexiCardTitle heading="Azure DevOps Pipeline Status" />
        <LoadingIndicator />
      </FlexiCard>
    );
  }

  return (
    <FlexiCard>
      <FlexiCardTitle heading="Azure DevOps Pipeline Status" />
      {showConfig ? (
        <VerticalRhythm gap="md" style={{ padding: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Organization</label>
            <Input
              type="text"
              value={tempConfig.organization}
              onChange={e => setTempConfig({ ...tempConfig, organization: e.currentTarget.value })}
              placeholder="e.g., nikitam"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Project</label>
            <Input
              type="text"
              value={tempConfig.project}
              onChange={e => setTempConfig({ ...tempConfig, project: e.currentTarget.value })}
              placeholder="e.g., nim-test1"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Pipeline ID</label>
            <Input
              type="text"
              value={tempConfig.pipelineId}
              onChange={e => setTempConfig({ ...tempConfig, pipelineId: e.currentTarget.value })}
              placeholder="e.g., 11"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Authorization Header</label>
            <Input
              type="password"
              value={tempConfig.authorization}
              onChange={e => setTempConfig({ ...tempConfig, authorization: e.currentTarget.value })}
              placeholder="e.g., Basic OjNPSUllNU94Wm...=="
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Pending changes function URL <span style={{ fontWeight: 'normal', color: '#888' }}>(optional)</span>
            </label>
            <Input
              type="text"
              value={tempConfig.pendingFunctionUrl}
              onChange={e => setTempConfig({ ...tempConfig, pendingFunctionUrl: e.currentTarget.value })}
              placeholder="https://<fn>.azurewebsites.net/api/pending?code=<host-key>"
            />
          </div>
          <Button
            onClick={() => {
              if (tempConfig.organization && tempConfig.project && tempConfig.pipelineId && tempConfig.authorization) {
                saveConfig(tempConfig);
              } else {
                setError('Please fill in all fields');
              }
            }}
          >
            Save Configuration
          </Button>
          {config && (
            <Button buttonType="secondary" onClick={() => setShowConfig(false)}>
              Cancel
            </Button>
          )}
        </VerticalRhythm>
      ) : (
        <>
          <div style={{ padding: '0.5rem 1rem', textAlign: 'right' }}>
            <Button buttonType="secondary" onClick={handleRefresh} disabled={loading} style={{ marginRight: '0.5rem' }}>
              Refresh
            </Button>
            <Button buttonType="secondary" onClick={() => setShowConfig(true)}>
              Configure
            </Button>
          </div>
          {error && (
            <div
              style={{
                padding: '1rem',
                color: 'red',
                backgroundColor: '#fee',
                borderRadius: '4px',
                margin: '0 1rem 1rem 1rem',
              }}
            >
              Error: {error}
            </div>
          )}
          {!error && runs.length === 0 && <div style={{ padding: '1rem' }}>No pipeline runs found.</div>}
          {runs.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem', fontWeight: 'bold' }}>Run Number</th>
                    <th style={{ padding: '0.75rem', fontWeight: 'bold' }}>Started</th>
                    <th style={{ padding: '0.75rem', fontWeight: 'bold' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.map(run => (
                    <tr key={run.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '0.75rem' }}>
                        <a
                          href={run._links.web.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#0078d4', textDecoration: 'none' }}
                        >
                          {run.name}
                        </a>
                      </td>
                      <td style={{ padding: '0.75rem' }}>{formatDate(run.createdDate)}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ marginRight: '0.5rem' }}>{getStatusIcon(run.state, run.result)}</span>
                        {getStatusText(run.state, run.result)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {config?.pendingFunctionUrl && (
            <div style={{ marginTop: '1.5rem' }}>
              <div
                style={{
                  padding: '0.75rem 1rem',
                  fontWeight: 'bold',
                  borderTop: '1px solid #eee',
                }}
              >
                Pending changes (next deploy)
              </div>
              {pendingError && (
                <div
                  style={{
                    padding: '1rem',
                    color: 'red',
                    backgroundColor: '#fee',
                    borderRadius: '4px',
                    margin: '0 1rem 1rem 1rem',
                  }}
                >
                  Error: {pendingError}
                </div>
              )}
              {!pendingError && pendingItems.length === 0 && (
                <div style={{ padding: '1rem' }}>No pending changes — the site is up to date.</div>
              )}
              {pendingItems.length > 0 && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                        <th style={{ padding: '0.75rem', fontWeight: 'bold' }}>Page</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingItems.map(item => {
                        const platformPath = platformPathFor(item);
                        return (
                          <tr key={item.path} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '0.75rem' }}>
                              {platformPath ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    router.navigatePlatform(platformPath, {
                                      projectId: metadata?.projectId,
                                      target: '_blank',
                                    })
                                  }
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                    font: 'inherit',
                                    color: '#0078d4',
                                    cursor: 'pointer',
                                    textDecoration: 'none',
                                  }}
                                >
                                  {item.path}
                                </button>
                              ) : (
                                item.path
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </FlexiCard>
  );
};

export default AzureDevOpsPipelineStatus;
