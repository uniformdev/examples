import { sequence } from "@sveltejs/kit/hooks";
import { createUniformHandle } from "@uniformdev/canvas-sveltekit";

/**
 * Uniform handle hook - parses preview cookies and attaches to locals
 */
const uniformHandle = createUniformHandle({
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
