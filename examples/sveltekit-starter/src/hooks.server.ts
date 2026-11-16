import { sequence } from "@sveltejs/kit/hooks";
import { createUniformHandle } from "@uniformdev/canvas-sveltekit";

import { UNIFORM_PREVIEW_SECRET } from "$app/env/private";

/**
 * Uniform handle hook - verifies the signed preview cookie and attaches it to locals
 */
const uniformHandle = createUniformHandle({
  secret: () => UNIFORM_PREVIEW_SECRET,
  onPreview: (event, previewData) => {
    // Optional: Log when preview mode is active
    if (previewData.isUniformContextualEditing) {
      // eslint-disable-next-line no-console
      console.log(
        "[Uniform] Contextual editing mode active for:",
        previewData.compositionPath
      );
    }
  },
});

export const handle = sequence(uniformHandle);
