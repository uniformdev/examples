import { FC, useEffect, useMemo } from "react";
import {
  UniformSlot,
  registerUniformComponent,
} from "@uniformdev/canvas-react";
import { buildSearchBox } from "@coveo/headless";
import { HeadlessEngineContext, getHeadlessEngine } from "../context/Engine";
import { Container } from "@mui/system";

//Coveo Facet docs https://docs.coveo.com/en/headless/latest/reference/search/controllers/facet/
const SearchProvider: FC = () => {
  const headlessEngine = useMemo(() => getHeadlessEngine(), []);

  const headlessSearchBox = useMemo(
    () => buildSearchBox(headlessEngine),
    [headlessEngine]
  );

  useEffect(() => {
    headlessSearchBox.submit();
  }, [headlessSearchBox]);

  return (
    <HeadlessEngineContext.Provider value={headlessEngine}>
      <Container>
        <UniformSlot name="searchContent" />
      </Container>
    </HeadlessEngineContext.Provider>
  );
};

registerUniformComponent({
  type: "searchProvider",
  component: SearchProvider,
});

export default SearchProvider;
