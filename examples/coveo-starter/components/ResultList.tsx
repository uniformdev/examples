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

  useEffect(() => {
    // Define the script content
    const scriptContent = `
      (function(c,o,v,e,O,u,a){
        a='coveoua';c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        c[a].t=Date.now();u=o.createElement(v);u.async=1;u.src=e;
        O=o.getElementsByTagName(v)[0];O.parentNode.insertBefore(u,O)
      })(window,document,'script','https://static.cloud.coveo.com/coveo.analytics.js/2/coveoua.js');
      coveoua('set', 'currencyCode', 'USD');
      coveoua('init','xxf6307da1-65ef-4598-8f2d-f097bad37731', 'https://analytics.cloud.coveo.com/rest/ua');
    `;

    // Create a script element
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.innerHTML = scriptContent;

    // Append the script to the document's body
    document.body.appendChild(script);

    // Clean up the script element when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const updateState = () => {
      setState(headlessResultList.state);
    };
    headlessResultList.subscribe(updateState);
  }, [imageField, titleField, descriptionField]);

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
