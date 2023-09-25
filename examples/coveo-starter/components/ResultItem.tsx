import {FC, useContext, useMemo} from "react";
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
import {
  buildFrequentlyViewedTogetherList,
  loadClickAnalyticsActions,
  ProductRecommendation
} from "@coveo/headless/product-recommendation";
import {ProductRecommendationEngineContext} from "../context/PREngine";

interface ResultItemProps {
  item: any;
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
  const productRecommendationsEngine = useContext(
      ProductRecommendationEngineContext
  );

  const frequentlyViewedTogether = useMemo(
      () =>
          buildFrequentlyViewedTogetherList(productRecommendationsEngine, {options: {maxNumberOfRecommendations: 50}}),
      [productRecommendationsEngine]
  );


  const interactiveResult = useMemo(
    () =>
      buildInteractiveResult(headlessEngine, {
        options: { result: item },
      }),
    [headlessEngine, item]
  );

  const handleClick = () => {
    interactiveResult.select();
    frequentlyViewedTogether.setSkus([item.uniqueId]);

    console.log(item);

    const scriptContent = `
      coveoua('init','xxf6307da1-65ef-4598-8f2d-f097bad37731', 'https://analytics.cloud.coveo.com/rest/ua')
      coveoua('send', 'pageview');
      coveoua('ec:addProduct', {
      'id': '${item.raw.permanentid}', 
      'name': '${item.raw.ec_name}',
      'category': '${item.raw.ec_category?.[0]}',
      'price': '${item.raw.price}',
      });

      coveoua('ec:setAction', 'detail'); 
      coveoua('send', 'event');
    `;

    // Create a script element
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.innerHTML = scriptContent;

    // Append the script to the document's body
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
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
        <Link onClick={handleClick} underline="none">
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
