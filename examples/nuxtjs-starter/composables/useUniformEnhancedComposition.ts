export async function useUniformEnhancedComposition(parameters: any) {
  const results = await useUniformComposition({
    ...parameters,
    unstable_resolveData: true,
    enhance: async (composition) => {
      const { composition: enhancedComposition } = await $fetch(
        "/api/enhance",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ composition }),
        }
      );
      return enhancedComposition;
    },
  });

  return results;
}
