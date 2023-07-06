import { FC, useEffect, useMemo, useState } from "react";
import { buildResultList } from "@coveo/headless";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Rating,
  Typography,
} from "@mui/material";
import headlessEngine from "../context/Engine";
import ResultLink from "./ResultLink";
import NoImg from "../public/no-img.svg";

const ResultList: FC = () => {
  const headlessResultList = useMemo(
    () =>
      buildResultList(headlessEngine, {
        options: {
          fieldsToInclude: [
            "ec_image",
            "ec_price",
            "ec_rating",
            "ytthumbnailurl",
          ],
        },
      }),
    []
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
            {result.raw.ytthumbnailurl ? (
              <CardMedia
                component="img"
                height="140"
                image={`${result.raw.ytthumbnailurl}`}
              />
            ) : (
              <CardMedia
                component="img"
                height="140"
                className="thumbnail-image"
                image={NoImg.src}
              />
            )}

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

export default ResultList;
