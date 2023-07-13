import { FC } from "react";
import { Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { Result } from "@coveo/headless";
import NoImg from "@/public/no-img.svg";
import ResultLink from "@/components/ResultLink";

interface ResultItemProps {
  item: Result;
  imageField: string;
}

const ResultItem: FC<ResultItemProps> = ({ item, imageField }) => {
  return (
    <Grid item xs={4} display="grid" alignItems="stretch" key={item.uniqueId}>
      <Card>
        <CardMedia
          component="img"
          height="140"
          className="thumbnail-image"
          image={`${item.raw[imageField] || NoImg.src}`}
        />
        <CardContent>
          <Typography variant="h5">
            <ResultLink result={item} />
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {item.excerpt}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ResultItem;
