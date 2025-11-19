// Custom composable to override the library's useUniformComposition
// This version calls our server route instead of making direct API calls
// Keeps the API key server-side only

interface UseUniformCompositionOptions {
  projectMapNodePath: string;
}

export function useUniformComposition(options: UseUniformCompositionOptions) {
  const nuxtApp = useNuxtApp();
  // Convert preview state to boolean - preview can be a PreviewState object or undefined
  const isPreview = !!nuxtApp.$preview;

  const { data: compositionData, error } = useAsyncData(
    `composition-${options.projectMapNodePath}-${isPreview}`,
    async () => {
      // Call server API route instead of direct Uniform API call
      // This keeps the API key server-side only
      const response = await $fetch("/api/uniform/composition", {
        query: { 
          path: options.projectMapNodePath,
          preview: isPreview 
        },
      });
      
      return response;
    }
  );

  // Return composition in a ref to match the library's API
  const composition = computed(() => compositionData.value?.composition);

  return {
    composition,
    error,
  };
}
