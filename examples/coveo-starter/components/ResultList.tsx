import { FC, useEffect, useMemo, useState } from "react";
import {
  ComponentProps,
  registerUniformComponent,
} from "@uniformdev/canvas-react";
import { buildResultList } from "@coveo/headless";
import { Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import headlessEngine from "../context/Engine";
import ResultLink from "./ResultLink";
import NoImg from "../public/no-img.svg";

type ResultListProps = ComponentProps<{
  resultList?: {
    resultListConfiguration?: {
      imageField?: string;
    };
  };
}>;

const ResultList: FC<ResultListProps> = ({ resultList }) => {
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

  return (
    <Grid container spacing={2}>
      {state.results.map((result) => (
        <Grid
          item
          xs={4}
          display="grid"
          alignItems="stretch"
          key={result.uniqueId}
        >
          <Card>
            <CardMedia
              component="img"
              height="140"
              className="thumbnail-image"
              image={`${result.raw[imageField] || NoImg.src}`}
            />
            <CardContent>
              <Typography variant="h5">
                <ResultLink result={result} />
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {result.excerpt}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

registerUniformComponent({
  type: "coveo-resultList",
  component: ResultList,
});

export default ResultList;
