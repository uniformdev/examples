import * as React from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { EMPTY_COMPOSITION } from "@uniformdev/canvas"
import { UniformComponent } from "@uniformdev/canvas-react"
import { resolveRenderer } from "../components/resolveRenderer.tsx"
import { fetchComposition, fetchCompositionById, keepSingleSlot } from "../utils/uniform/composition.ts"
import { isMFEComposition, PreviewProvider, usePreview } from "@repo/uniform-preview/react"
import { UniformContext } from "@uniformdev/context-react"
import { Context, enableContextDevTools, ManifestV2 } from "@uniformdev/context"
import manifest from '../contextManifest.json'

const context = new Context({
  defaultConsent: true,
  manifest: manifest as ManifestV2,
  plugins: [enableContextDevTools()],
});

export const Route = createRootRoute({
  component: RootComponent,
  loader: async (ctx) => {
    const searchParams = new URLSearchParams(ctx.location.search);
    const compositionId = searchParams.get('compositionId');
    const isPreview = searchParams.get('preview') === 'true';

    try {
      if (compositionId) {
        const state = isPreview ? 'draft' : 'published';
        const composition = await fetchCompositionById(compositionId, state);
        return { composition, isPreview }
      }

      const composition = await fetchComposition(ctx.location.pathname)
      if (isMFEComposition(composition)) {
        return { composition, isPreview, isMFE: true }
      }
      return { composition: null, isPreview, isMFE: false }
    } catch {
      return { composition: null, isPreview: false, isMFE: false }
    }
  }
});

function RootComponent () {
  return (
    <UniformContext context={context}>
      <PreviewProvider>
        <RootComponentInner/>
      </PreviewProvider>
    </UniformContext>
  );
}

function RootComponentInner () {
  const { composition: data } = Route.useLoaderData()
  const { isContextualEditing, isPlayground, previewComposition } = usePreview()

  const activeComposition = (isContextualEditing && previewComposition)
    ? previewComposition
    : data;

  // The host defines a special composition type which is designed to signify we are showing
  // MFE compositions in-between the header and the footer.
  const isMFE = isMFEComposition(activeComposition)

  // When we are editing a composition which is coming from a MFE then we want to
  // render the header and the footer from the host
  const showChrome = isPlayground
    ? false
    : isContextualEditing ? isMFE && !!activeComposition : !!activeComposition;

  console.log('HOST[__root]', { isContextualEditing, isMFE, showChrome, activeComposition });
  return (
    <React.Fragment>
      {showChrome ? (
        <>
          <UniformComponent data={keepSingleSlot(activeComposition, 'header') ?? EMPTY_COMPOSITION}
                            resolveRenderer={resolveRenderer}/>
          <div className="p-4">
            <Outlet/>
          </div>
          <UniformComponent data={keepSingleSlot(activeComposition, 'footer') ?? EMPTY_COMPOSITION}
                            resolveRenderer={resolveRenderer}/>
        </>
      ) : (
        <Outlet/>
      )}
    </React.Fragment>
  );
}
