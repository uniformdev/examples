'use client';

import { useEffect, useRef } from 'react';
import { engineDefinition } from '../../lib/coveo/engine-definition';
import { buildSSRSearchParameterSerializer } from '@coveo/headless-react/ssr';

const {
  controllers: { useSearchParameterManager, useResultList },
} = engineDefinition;
const { toSearchParameters, serialize } = buildSSRSearchParameterSerializer();

/**
 * Gets the current URL hash fragment as URLSearchParams
 */
function getHashSearchParams(): URLSearchParams {
  if (typeof window === 'undefined') {
    return new URLSearchParams();
  }
  const hash = window.location.hash.slice(1);
  return new URLSearchParams(hash);
}

/**
 * Component that synchronizes URL hash parameters with Coveo search state
 * Following the simplified pattern from Coveo documentation
 */
export function URLSearchParameterSync() {
  const { state, methods } = useSearchParameterManager();
  const { state: resultListState } = useResultList();
  const isInitializedRef = useRef(false);

  // Initialize search state from URL on mount
  useEffect(() => {
    if (isInitializedRef.current || !methods) {
      return;
    }

    const hashParams = getHashSearchParams();
    if (hashParams.toString()) {
      const parameters = toSearchParameters(hashParams);
      methods.synchronize(parameters);
    }
    isInitializedRef.current = true;
  }, [methods]);

  // Update URL when search parameters change
  useEffect(() => {
    if (!isInitializedRef.current) {
      return;
    }

    // Create a temporary URL to serialize parameters into query string
    const baseUrl = new URL(window.location.origin + window.location.pathname);
    const serializedUrl = serialize(state.parameters, baseUrl);

    // Extract query string from serialized URL and use it as hash
    const urlObj = new URL(serializedUrl);
    const queryString = urlObj.search.slice(1); // Remove the '?'
    const newHash = queryString ? `#${queryString}` : '';

    // Use replaceState for initial load, pushState for subsequent changes
    if (!resultListState.firstSearchExecuted) {
      window.history.replaceState(null, '', window.location.pathname + newHash);
    } else {
      window.history.pushState(null, '', window.location.pathname + newHash);
    }
  }, [state.parameters, resultListState.firstSearchExecuted]);

  // Listen for hash changes (browser back/forward navigation)
  useEffect(() => {
    if (!methods) {
      return;
    }

    const handleHashChange = () => {
      const hashParams = getHashSearchParams();
      const parameters = toSearchParameters(hashParams);
      methods.synchronize(parameters);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [methods]);

  // This component doesn't render anything
  return null;
}
