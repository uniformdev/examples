import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { IN_CONTEXT_EDITOR_PLAYGROUND_QUERY_STRING_PARAM, RootComponentInstance } from '@uniformdev/canvas';
import { IN_CONTEXT_EDITOR_QUERY_STRING_PARAM } from '@uniformdev/canvas';

export const MFE_COMPOSITION_TYPE = 'moduleRootPage'

export function isMFEComposition(composition: RootComponentInstance | null): boolean {
  return composition?.type === MFE_COMPOSITION_TYPE;
}

export function isPreviewMode(app?: string): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  const isPreview = params.get('preview') === 'true';
  if (app) {
    return isPreview && params.get('app') === app;
  }
  return isPreview;
}

function isPlaygroundMode(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.get(IN_CONTEXT_EDITOR_PLAYGROUND_QUERY_STRING_PARAM) === 'true';
}

function isContextualEditingMode(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.get(IN_CONTEXT_EDITOR_QUERY_STRING_PARAM) === 'true';
}

function getCompositionId(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get('compositionId');
}

interface PreviewContextType {
  isPreview: boolean;
  isPlayground: boolean;
  isContextualEditing: boolean;
  compositionId: string | null;
  previewComposition: RootComponentInstance | null;
  setPreviewComposition: (composition: RootComponentInstance | null) => void;
}

const PreviewContext = createContext<PreviewContextType | undefined>(undefined);

export function PreviewProvider({ children }: { children: ReactNode }) {
  const [isPreview, setIsPreview] = useState(false);
  const [isPlayground, setIsPlayground] = useState(false);
  const [isContextualEditing, setIsContextualEditing] = useState(false);
  const [compositionId, setCompositionId] = useState<string | null>(null);
  const [previewComposition, setPreviewComposition] = useState<RootComponentInstance | null>(null);

  useEffect(() => {
    const preview = isPreviewMode();
    const playground = isPlaygroundMode();
    const contextual = isContextualEditingMode();
    const compId = getCompositionId();

    setIsPreview(preview);
    setIsPlayground(playground);
    setIsContextualEditing(contextual);
    setCompositionId(compId);

    const handleMessage = (event: MessageEvent) => {
      const allowedOrigins = ['https://uniform.app', 'https://eu.uniform.app'];
      const isAllowed = allowedOrigins.some(origin =>
        event.origin === origin || event.origin.endsWith('.uniform.app')
      );

      if (!isAllowed) {
        return;
      }

      if (event.data && event.data.type === 'uniform:composition:update') {
        setPreviewComposition(event.data.composition);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const value = useMemo((): PreviewContextType => ({
    isPreview,
    isPlayground,
    isContextualEditing,
    compositionId,
    previewComposition,
    setPreviewComposition,
  }), [
    isPreview,
    isPlayground,
    isContextualEditing,
    compositionId,
    previewComposition,
  ])

  return (
    <PreviewContext.Provider value={value}>
      {children}
    </PreviewContext.Provider>
  );
}

export function usePreview() {
  const context = useContext(PreviewContext);
  if (context === undefined) {
    throw new Error('usePreview must be used within a PreviewProvider');
  }
  return context;
}
