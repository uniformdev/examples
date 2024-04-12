import Link from 'next/link';
import React from 'react';
import { IN_CONTEXT_EDITOR_QUERY_STRING_PARAM } from '@uniformdev/canvas';

/**
 * Renders banner only on deployed by Uniform preview environment
 */
export const UniformDeployedPreviewBanner = () => {
  const [isVisible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const isOpenedByInContextEditor =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has(
        IN_CONTEXT_EDITOR_QUERY_STRING_PARAM
      );

    if (isOpenedByInContextEditor && process.env.NEXT_PUBLIC_SHOW_DEPLOYED_BANNER) {
      setVisible(true);
    }
  }, []);

  return isVisible ? (
    <div className="deployed-preview-banner">
      <p>This preview is powered by a pre-deployed site. Click {' '}
        <Link
          data-is-rendered-by-uniform
          target="_blank"
          href="https://docs.uniform.app/docs/get-started/starters/hello-world"
        >
          here
        </Link>
        {' '}to learn how to set up your own.
      </p>
    </div>
  ) : null;
}