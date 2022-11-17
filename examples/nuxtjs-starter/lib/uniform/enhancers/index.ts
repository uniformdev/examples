import { enhance, compose, EnhancerBuilder } from "@uniformdev/canvas";
import { sitecoreItemEnhancer } from "./sitecore";

// import { cloudinaryEnhancer, CLOUDINARY_PARAMETER_TYPES } from "./cloudinary";

// import {
//   algoliaQueryEnhancer,
//   CANVAS_ALGOLIA_QUERY_PARAMETER_TYPES,
// } from "./algolia";

// TODO:
// import {
//   contentfulEnhancer,
//   contentfulQueryEnhancer,
//   CANVAS_CONTENTFUL_PARAMETER_TYPES,
//   CANVAS_CONTENTFUL_QUERY_PARAMETER_TYPES,
//   contentfulModelConverter,
// } from "./contentful";

export default async function runEnhancers(
  composition: any,
  isPreview: boolean
) {
  await enhance({
    composition,
    context: {
      preview: isPreview,
    },
    enhancers: new EnhancerBuilder().parameterType(
      "sitecoreItem",
      sitecoreItemEnhancer()
    ),
    // .parameterType(
    //   CANVAS_CONTENTFUL_PARAMETER_TYPES,
    //   compose(contentfulEnhancer(), contentfulModelConverter)
    // )
    // .parameterType(
    //   CANVAS_CONTENTFUL_QUERY_PARAMETER_TYPES,
    //   compose(contentfulQueryEnhancer(), contentfulModelConverter)
    // )
    // .parameterType(CLOUDINARY_PARAMETER_TYPES, cloudinaryEnhancer())
    // .parameterType(
    //   CANVAS_ALGOLIA_QUERY_PARAMETER_TYPES,
    //   algoliaQueryEnhancer()
    // ),
  });
}
