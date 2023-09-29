import { FC, useContext, useEffect, useMemo, useState } from "react";
import { ComponentInstance } from "@uniformdev/canvas";
import {
  ComponentProps,
  registerUniformComponent,
} from "@uniformdev/canvas-react";
import { buildResultList, Result } from "@coveo/headless";
import { Button, Grid, Typography } from "@mui/material";
import { HeadlessEngineContext } from "../context/Engine";
import ResultItem from "@/components/ResultItem";

enum ItemTypes {
  Item = "coveo-result-list-item",
}

type ResultListProps = ComponentProps<{
  resultList?: {
    resultListConfiguration?: {
      imageField?: string;
      titleField?: string;
      descriptionField?: string;
    };
  };
  useExcerptAsDescription?: boolean;
}>;

//Coveo Result List docs https://docs.coveo.com/en/headless/latest/reference/search/controllers/result-list/

const ResultList: FC<ResultListProps> = (componentProps: ResultListProps) => {
  const { resultList, component, useExcerptAsDescription } =
    componentProps || {};

  const {
    imageField = "",
    descriptionField = "",
    titleField = "",
  } = resultList?.resultListConfiguration || {};

  const headlessEngine = useContext(HeadlessEngineContext);

  const headlessResultList = useMemo(
    () =>
      buildResultList(headlessEngine, {
        options: {
          fieldsToInclude: [
            "ec_name",
            "ec_category",
            "price",
            ...[imageField, titleField, descriptionField].filter(
              (item) => item
            ),
          ],
        },
      }),
    [imageField, titleField, descriptionField, headlessEngine]
  );

  const [state, setState] = useState(headlessResultList.state);

  useEffect(
    () =>
      headlessResultList.subscribe(() => {
        setState(headlessResultList.state);
      }),
    [imageField, titleField, descriptionField, headlessResultList]
  );

  const renderResultItem = (component: ComponentInstance, item: Result) => {
    const itemType = component?.slots?.resultItemComponent?.[0]?.type;

    return itemType === ItemTypes.Item ? (
      <ResultItem
        item={item}
        imageField={imageField}
        descriptionField={descriptionField}
        useExcerptAsDescription={useExcerptAsDescription}
        titleField={titleField}
        key={item.uniqueId}
      />
    ) : (
      <Grid item xs={4} display="grid" alignItems="stretch" key={item.uniqueId}>
        <Typography gutterBottom>Add your custom Result Item</Typography>
      </Grid>
    );
  };

  return (
    <Grid container spacing={2}>
      {state.results.map((result) => renderResultItem(component, result))}
      <Button onClick={() => headlessResultList.fetchMoreResults()}>
        Load more
      </Button>
    </Grid>
  );
};

registerUniformComponent({
  type: "coveo-resultList",
  component: ResultList,
});

export default ResultList;
