import { getCompositionsForNavigation } from "@/lib/uniform/projectMap";

export function useUniformProjectMapNodes() {
  const nuxtApp = useNuxtApp();
  const isPreview = nuxtApp.$preview as boolean;
  const uniformConfig = useRuntimeConfig().public.$uniform;

  const result = useAsyncData(
    `project-map-nodes-${isPreview}`,
    async () =>
      await getCompositionsForNavigation({
        isPreview,
        apiHost: uniformConfig.apiHost,
        apiKey: uniformConfig.readOnlyApiKey,
        projectId: uniformConfig.projectId,
      })
  );

  return result;
}
