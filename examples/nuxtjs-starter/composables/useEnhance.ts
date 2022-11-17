export async function useEnhance(composition: any, slug: string) {
  const { data, pending, error } = await useAsyncData(
    `composition-enhancer-${slug}`,
    () => {
      return $fetch("/api/enhance", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ composition }),
      });
    }
  );

  return { data, pending, error };
}
