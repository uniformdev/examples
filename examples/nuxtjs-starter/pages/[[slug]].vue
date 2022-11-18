<script lang="ts" setup>
import { resolveRenderer } from "../components/componentMapping";
import {
  CANVAS_DRAFT_STATE,
  CANVAS_PUBLISHED_STATE,
  CompositionGetListResponse,
} from "@uniformdev/canvas";
import {
  useCompositionInstance,
  createApiEnhancer,
} from "@uniformdev/canvas-vue";

const { slug: compositionSlug } = useRoute().params;
const slug = !compositionSlug ? "/" : compositionSlug;
const { $useComposition, $uniformCanvasClient, $preview } = useNuxtApp();
const { data: rawComposition } = await $useComposition({ slug });
const { data: enhancedComposition } = await useEnhance(
  rawComposition.value?.composition,
  slug as string
);
const { composition } = useCompositionInstance({
  composition: enhancedComposition.value.composition,
  enhance: createApiEnhancer({
    apiUrl: "/api/enhance",
  }),
});

if (!composition.value) {
  throw createError({ statusCode: 404, statusMessage: "Page Not Found" });
}

const { compositions }: CompositionGetListResponse =
  await $uniformCanvasClient.getCompositionList({
    skipEnhance: true,
    state: $preview ? CANVAS_DRAFT_STATE : CANVAS_PUBLISHED_STATE,
  });
const { metaTitle } = composition.value?.parameters || {};
const title = metaTitle?.value as string;
const navLinks = compositions
  .filter((c) => c.composition._slug)
  .map((c) => {
    return {
      title: c.composition._name,
      url: c.composition._slug,
    };
  });
</script>

<template>
  <div class="page">
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <Navigation :navLinks="navLinks" />
    <Composition
      v-if="composition"
      :data="composition"
      :resolve-renderer="resolveRenderer"
      behaviorTracking="onLoad"
    >
      <SlotContent name="content" />
    </Composition>
    <Footer />
  </div>
</template>
