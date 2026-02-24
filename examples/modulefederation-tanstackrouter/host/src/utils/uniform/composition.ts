import type { RootComponentInstance } from "@uniformdev/canvas"
import { createCompositionApi } from "@repo/uniform-preview/api"

export function keepSingleSlot(composition: RootComponentInstance | null | undefined, slot: string): RootComponentInstance | null | undefined {
  if (!composition) return composition
  return {
    ...composition,
    slots: {
      [slot]: composition.slots?.[slot] ?? []
    }
  }
}

const { fetchComposition, fetchCompositionById } = createCompositionApi({ apiBase: 'http://localhost:5173' })

export { fetchComposition, fetchCompositionById }
