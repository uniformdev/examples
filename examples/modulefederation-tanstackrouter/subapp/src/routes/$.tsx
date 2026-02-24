import { createFileRoute } from '@tanstack/react-router'
import { UniformComposition } from "@uniformdev/canvas-react"
import { EMPTY_COMPOSITION } from "@uniformdev/canvas"
import { resolveRenderer } from "../components/resolveRenderer.tsx"
import { isMFEComposition, usePreview } from "@repo/uniform-preview/react"
import { fetchComposition, fetchCompositionById } from "../utils/uniform/composition.ts"

export const Route = createFileRoute('/$')({
  component: RouteComponent,
  loader: async (ctx) => {
    const searchParams = new URLSearchParams(ctx.location.search);
    const compositionId = searchParams.get('compositionId');
    const isPreview = searchParams.get('preview') === 'true';

    // We need to detect if the editing mode is part of the current project
    const isEditingCurrentMFE = typeof window !== 'undefined' && window.location.href.startsWith('http://localhost:5183');

    if (compositionId && isEditingCurrentMFE) {
      const state = isPreview ? 'draft' : 'published';
      const composition = await fetchCompositionById(compositionId, state);
      return { composition, isEditingCurrentMFE }
    }

    const composition = await fetchComposition(ctx.location.pathname)
    if (isMFEComposition(composition)) {
      return { composition: null, isEditingCurrentMFE }
    }
    return { composition, isEditingCurrentMFE }
  }
})

function RouteComponent () {
  const data = Route.useLoaderData()
  const { isContextualEditing, previewComposition } = usePreview()

  const activeComposition = (isContextualEditing && previewComposition && data.isEditingCurrentMFE)
    ? previewComposition
    : data.composition;

  console.log('SUBAPP[$]', { isContextualEditing, activeComposition });
  return (
    <div>
      <UniformComposition data={activeComposition ?? EMPTY_COMPOSITION} resolveRenderer={resolveRenderer}/>
    </div>
  )
}
