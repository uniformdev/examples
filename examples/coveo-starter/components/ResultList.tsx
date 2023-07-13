import { FC, useEffect, useMemo, useState } from "react";
import {
  ComponentProps,
  registerUniformComponent,
  UniformSlot,
} from "@uniformdev/canvas-react";
import { buildResultList, Result } from "@coveo/headless";
import { Grid, Typography } from "@mui/material";
import headlessEngine from "../context/Engine";
import { ComponentInstance } from "@uniformdev/canvas";
import ResultItem from "@/components/ResultItem";

enum ItemTypes {
  Item = "coveo-result-list-item",
}

type ResultListProps = ComponentProps<{
  resultList?: {
    resultListConfiguration?: {
      imageField?: string;
    };
  };
}>;

//Coveo Result List docs https://docs.coveo.com/en/headless/latest/reference/search/controllers/result-list/

const ResultList: FC<ResultListProps> = (componentProps: ResultListProps) => {
  const { resultList, component } = componentProps || {};

  const { imageField = "" } = resultList?.resultListConfiguration || {};

  const headlessResultList = useMemo(
    () =>
      buildResultList(headlessEngine, {
        options: {
          fieldsToInclude: imageField ? [imageField, "ec_image"] : ["ec_image"],
        },
      }),
    [imageField]
  );

  const [state, setState] = useState(headlessResultList.state);

  useEffect(() => {
    const updateState = () => {
      setState(headlessResultList.state);
    };
    headlessResultList.subscribe(updateState);
  }, []);

  const renderResultItem = (component: ComponentInstance, item: Result) => {
    const itemType = component?.slots?.resultItemComponent?.[0]?.type;

    return itemType === ItemTypes.Item ? (
      <ResultItem item={item} imageField={imageField} key={item.uniqueId} />
    ) : (
      <Grid item xs={4} display="grid" alignItems="stretch" key={item.uniqueId}>
        <Typography gutterBottom>Add your custom Result Item</Typography>
      </Grid>
    );
  };

  return (
    <Grid container spacing={2}>
      {state.results.map((result) => renderResultItem(component, result))}
    </Grid>
  );
};

registerUniformComponent({
  type: "coveo-resultList",
  component: ResultList,
});

export default ResultList;
