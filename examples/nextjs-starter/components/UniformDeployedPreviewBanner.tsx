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
      <span>
        This is a Uniform-deploy preview.
      </span>
      <Link
        target="_blank"
        href="https://docs.uniform.app/getting-started/starters"
      >
        Click here to learn how switch to your own!
      </Link>
    </div>
  ) : null;
}