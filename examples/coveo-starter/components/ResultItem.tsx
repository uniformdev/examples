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

  const handleClick = () => {
    interactiveResult.select();
  };

  const { image, description, title } = useMemo(
    () => ({
      image: `${item.raw[imageField] || NoImg.src}`,
      title: `${item.raw[titleField] || ""}`,
      description: `${item.raw[descriptionField] || ""}`,
    }),
    [titleField, imageField, descriptionField]
  );

  return (
    <Grid item xs={4} display="grid" alignItems="stretch">
      <Card>
        <Link href={item.clickUri} target="_blank" onClick={handleClick} underline="none">
          <CardMedia
            component="img"
            height="140"
            className="thumbnail-image"
            image={image}
          />
          <CardContent>
            <Typography variant="h5">{title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {useExcerptAsDescription ? item.excerpt : description}
            </Typography>
          </CardContent>
        </Link>
      </Card>
    </Grid>
  );
};

export default ResultItem;
