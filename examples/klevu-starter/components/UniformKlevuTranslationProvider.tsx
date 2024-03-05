import { createContext, useContext, useMemo } from "react";

import { default as en } from "@/translations/en.json";

type Simplify<T> = {[K in keyof T]: T[K]} & {};

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? Simplify<DeepPartial<T[K]>> : T[K]
}

type Translation = Simplify<DeepPartial<typeof en>>;

const UniformKlevuTranslationContext = createContext<Translation | null>(null);

export type  UniformKlevuTranslationProviderProps = React.PropsWithChildren<{
  fallbackTranslation: Translation | null;
}>

export const UniformKlevuTranslationProvider = ({
  fallbackTranslation,
  children,
}: UniformKlevuTranslationProviderProps) => {
  return (
    <UniformKlevuTranslationContext.Provider value={fallbackTranslation}>
      {children}
    </UniformKlevuTranslationContext.Provider>
  );
};

export function useFallbackTranslation() : Translation {
  const value = useContext(UniformKlevuTranslationContext);

  return value ?? en;
}