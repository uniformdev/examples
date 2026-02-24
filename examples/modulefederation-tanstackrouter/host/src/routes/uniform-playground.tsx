import { UniformPlayground } from '@uniformdev/canvas-react';
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute('/uniform-playground')({
  component: RouteComponent,
})

/**
 * Uniform Playground Page
 *
 * Provides an isolated preview environment for testing Uniform patterns
 * and components outside of full composition contexts.
 *
 * Features:
 * - Component pattern preview
 * - Isolated component testing
 */
function RouteComponent() {
  return (
      <UniformPlayground
        behaviorTracking="onLoad"
      />
  );
}

