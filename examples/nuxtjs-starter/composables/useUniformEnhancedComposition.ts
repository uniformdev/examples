export async function useUniformEnhancedComposition(
  parameters: Parameters<typeof useUniformComposition>[0]
) {
  const results = await useUniformComposition({
    ...parameters,
    enhance: async (composition) => {
      const { composition: enhancedComposition } = await $fetch<{
        composition: typeof composition;
      }>("/api/enhance", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ composition }),
      });
      return enhancedComposition;
    },
  });

  return results;
}
