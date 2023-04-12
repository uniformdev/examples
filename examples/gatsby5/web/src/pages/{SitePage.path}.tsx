import * as React from "react";
import type {
  GetServerDataProps,
  GetServerDataReturn,
  PageProps,
} from "gatsby";
import PageComponent from "../components/Page";
import { Hero } from "../components/Hero";
import { CTA } from "../components/CTA";
import { GenericGrid } from "../components/GenericGrid";
import { GenericCard } from "../components/GenericCard";
import { OfferingCard } from "../components/OfferingCard";
import { OfferingGrid } from "../components/OfferingGrid";
import {
  CANVAS_DRAFT_STATE,
  CANVAS_PUBLISHED_STATE,
  CanvasClient,
  ComponentInstance,
  enhance,
  EnhancerBuilder,
  RootComponentInstance,
} from "@uniformdev/canvas";
import createSanityClient from "@sanity/client";
import {
  CANVAS_SANITY_PARAMETER_TYPES,
  createSanityEnhancer,
} from "@uniformdev/canvas-sanity";
import {
  ComponentProps,
  UniformComposition,
  UniformCompositionProps,
  UniformSlot,
} from "@uniformdev/canvas-react";
import { Default } from "../components/Default";

// Sanity enhancer function
export async function enhanceComposition(composition: RootComponentInstance) {
  const sanityClient = createSanityClient({
    projectId: process.env.GATSBY_SANITY_PROJECT_ID,
    dataset: process.env.GATSBY_SANITY_DATASET,
    useCdn: false,
  });

  // Create a modified enhancer to enhance the images and return offeringImage
  const sanityEnhancer = createSanityEnhancer({
    client: sanityClient,
    modifyQuery: (options) => {
      options.query = `*[_id == $id][0] { 
        "offeringImage": offeringImage.asset->url,
        "image": image.asset->url,
        ...
      }`;

      return options;
    },
  });
  await enhance({
    composition,
    enhancers: new EnhancerBuilder().parameterType(
      CANVAS_SANITY_PARAMETER_TYPES,
      sanityEnhancer
    ),
    context: {},
  });
}

// function to get composition
export const getComposition = async (path: string) => {
  const client = new CanvasClient({
    apiKey: process.env.GATSBY_UNIFORM_API_KEY,
    projectId: process.env.GATSBY_UNIFORM_PROJECT_ID,
  });
  const { composition } = await client.getCompositionBySlug({
    slug: path === "dev-404-page" ? "/" : path,
    state:
      process.env.NODE_ENV === "development"
        ? CANVAS_DRAFT_STATE
        : CANVAS_PUBLISHED_STATE,
  });
  return composition;
};

// Function to fetch Composition serverside for use in the page component.
export async function getServerData({
  headers,
  method,
  url,
  query,
  params,
}: GetServerDataProps): GetServerDataReturn {
  // console.log({ headers, method, url, query, params });
  let { path } = params || {};
  const { slug } = query || {};
  console.log({ path, slug });

  if (path === "dev-404-page") {
    return {
      status: 404,
      props: {},
    };
  }
  const composition = await getComposition(
    (path as string) || (slug as string) || "/"
  );

  // Enhance composition
  await enhanceComposition(composition);
  console.log({ composition });
  // Return enhanced composition
  return {
    status: 200,
    props: { composition },
  };
}

// Resolve Render function
export function componentResolutionRenderer(
  component: ComponentInstance
): React.ComponentType<ComponentProps<any>> {
  switch (component.type) {
    case "hero":
      return Hero;
    case "callToAction":
      return CTA;
    case "genericCard":
      return GenericCard;
    case "genericGrid":
      return GenericGrid;
    case "offeringCard":
      return OfferingCard;
    case "offeringGrid":
      return OfferingGrid;
    default:
      return Default;
  }
}

const Page = (props: PageProps) => {
  const { serverData } = props;
  const { composition } = (serverData as any) || {};
  const contextualEditingEnhancer: UniformCompositionProps["contextualEditingEnhancer"] =
    async ({ composition }) => {
      await enhanceComposition(composition);
      return composition;
    };

  return (
    <PageComponent>
      <UniformComposition
        data={composition}
        resolveRenderer={componentResolutionRenderer}
        contextualEditingEnhancer={contextualEditingEnhancer}
      >
        <UniformSlot name="content" />
      </UniformComposition>
    </PageComponent>
  );
};

export default Page;
