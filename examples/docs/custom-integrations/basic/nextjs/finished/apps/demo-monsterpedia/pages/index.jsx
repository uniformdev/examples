import {
  CanvasClient,
  enhance,
  EnhancerBuilder,
  CANVAS_DRAFT_STATE,
  CANVAS_PUBLISHED_STATE,
} from "@uniformdev/canvas";
import { Composition } from "@uniformdev/canvas-react";
import {
  CANVAS_MONSTER_LIST_PARAMETER_TYPES,
  createMonsterEnhancer,
} from "canvas-monsterpedia";
import { createClient } from "monsterpedia";

import { useLivePreviewNextStaticProps } from "../hooks/useLivePreviewNextStaticProps";
import resolveRenderer from "../lib/resolveRenderer";
import LandingPageLayout from "../components/LandingPageLayout";

export async function getStaticProps({ preview }) {
  const slug = "/";
  const composition = await getComposition(slug, preview);
  const enhancers = getEnhancers();
  await enhance({ composition, enhancers });
  return {
    props: { composition },
  };
}

export default function Home({ composition }) {
  useLivePreviewNextStaticProps({
    compositionId: composition._id,
    projectId: process.env.NEXT_PUBLIC_UNIFORM_PROJECT_ID,
  });

  return (
    <Composition data={composition} resolveRenderer={resolveRenderer}>
      <LandingPageLayout composition={composition} />
    </Composition>
  );
}

async function getComposition(slug, preview) {
  const client = new CanvasClient({
    apiKey: process.env.UNIFORM_API_KEY,
    projectId: process.env.NEXT_PUBLIC_UNIFORM_PROJECT_ID,
  });
  const { composition } = await client.getCompositionBySlug({
    slug,
    state: preview ? CANVAS_DRAFT_STATE : CANVAS_PUBLISHED_STATE,
  });
  return composition;
}

function getEnhancers() {
  const client = createClient(process.env.MONSTERPEDIA_BASE_URL);
  const monsterEnhancer = createMonsterEnhancer(client);
  return new EnhancerBuilder().parameterType(
    CANVAS_MONSTER_LIST_PARAMETER_TYPES,
    monsterEnhancer
  );
}
