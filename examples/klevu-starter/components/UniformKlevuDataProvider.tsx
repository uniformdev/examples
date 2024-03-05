import { FilterManager, KlevuRecord, KlevuResponseQueryObject } from "@klevu/core";
import { createContext, useContext, useMemo } from "react";

export type UniformKlevuDataContext = {
  records?: KlevuRecord[];
  filterManager?: FilterManager;
  resultObject?: KlevuResponseQueryObject;
}

const UniformKlevuDataContext = createContext<UniformKlevuDataContext>({});

export type  UniformKlevuDataProviderProps = React.PropsWithChildren<{
  records?: KlevuRecord[];
  filterManager?: FilterManager;
  resultObject?: KlevuResponseQueryObject;
}>

export const UniformKlevuDataProvider = ({
  records,
  filterManager,
  resultObject,
  children,
}: UniformKlevuDataProviderProps) => {  
  const value = useMemo<UniformKlevuDataContext>(() => {
    return {
      records,
      filterManager,
      resultObject,
    }
  }, [records, filterManager, resultObject]);


  return <UniformKlevuDataContext.Provider value={value}>{children}</UniformKlevuDataContext.Provider>;
};

export function useKlevuDataContext() {
  const value = useContext(UniformKlevuDataContext);

  return value;
}