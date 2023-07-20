import { FC, useMemo } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { buildInteractiveResult, Result } from "@coveo/headless";
import NoImg from "@/public/no-img.svg";
import headlessEngine from "../context/Engine";

interface ResultItemProps {
  item: Result;
  imageField: string;
  titleField?: string;
  descriptionField?: string;
  useExcerptAsDescription?: boolean;
}

const ResultItem: FC<ResultItemProps> = ({
  item,
  imageField,
  descriptionField = "",
  titleField = "",
  useExcerptAsDescription,
}) => {
  const interactiveResult = useMemo(
    () =>
      buildInteractiveResult(headlessEngine, {
        options: { result: item },
      }),
    [headlessEngine, item]
  );

  console.log(item, titleField, descriptionField)

  const handleClick = () => {
    interactiveResult.select();
  };

  return (
    <Grid item xs={4} display="grid" alignItems="stretch">
      <Card>
        <Link href={item.clickUri} target="_blank" onClick={handleClick}>
          <CardMedia
            component="img"
            height="140"
            className="thumbnail-image"
            image={`${item.raw[imageField] || NoImg.src}`}
          />
          <CardContent>
            <Typography variant="h5">
              {`${item.raw[titleField] || ""}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {useExcerptAsDescription
                ? item.excerpt
                : `${item.raw[descriptionField] || ""}`}
            </Typography>
          </CardContent>
        </Link>
      </Card>
    </Grid>
  );
};

export default ResultItem;
