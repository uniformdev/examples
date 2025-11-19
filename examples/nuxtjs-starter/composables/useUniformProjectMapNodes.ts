export function useUniformProjectMapNodes() {
  const nuxtApp = useNuxtApp();
  const isPreview = nuxtApp.$preview as boolean;

  return useAsyncData(
    `project-map-nodes-${isPreview}`,
    async () => {
      // Call server API route instead of direct Uniform API call
      // This keeps the API key server-side only
      return await $fetch("/api/uniform/project-map", {
        query: { preview: isPreview },
      });
    }
  );
}
