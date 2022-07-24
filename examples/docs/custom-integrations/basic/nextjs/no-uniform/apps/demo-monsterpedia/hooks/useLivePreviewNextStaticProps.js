import { useRouter } from "next/router";
import { useCallback } from "react";
import { useCompositionEventEffect } from "@uniformdev/canvas-react";

//
//This function is required for Next.js live preview.
export function useLivePreviewNextStaticProps(options) {
  const router = useRouter();

  const effect = useCallback(() => {
    router.replace(router.asPath, undefined, { scroll: false });
  }, [router]);

  return useCompositionEventEffect({
    ...options,
    enabled: router.isPreview,
    effect,
  });
}
