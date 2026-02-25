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

    try {
      if (compositionId) {
        const state = isPreview ? 'draft' : 'published';
        return await fetchCompositionById(compositionId, state);
      }

      const composition = await fetchComposition(ctx.location.pathname)
      if (isMFEComposition(composition)) {
        return null
      }
      return composition
    } catch {
      return null
    }
  }
})

function RouteComponent () {
  const data = Route.useLoaderData()
  const { isContextualEditing, previewComposition } = usePreview()

  const activeComposition = (isContextualEditing && previewComposition)
    ? previewComposition
    : data;

  console.log('HOST[$]', { isContextualEditing, activeComposition });
  return (
    <div>
      <UniformComposition data={activeComposition ?? EMPTY_COMPOSITION} resolveRenderer={resolveRenderer}/>
    </div>
  )
}
