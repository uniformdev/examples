<script lang="ts" setup>
import {
  CANVAS_DRAFT_STATE,
  CANVAS_PUBLISHED_STATE,
  CompositionGetListResponse,
} from "@uniformdev/canvas";

const { slug: slugWithoutSlash } = useRoute().params;

const slug = `/${slugWithoutSlash}`;

const { $useComposition, $uniformCanvasClient, $preview } = useNuxtApp();
const { data } = await $useComposition({ slug });

const { compositions }: CompositionGetListResponse =
  await $uniformCanvasClient.getCompositionList({
    skipEnhance: true,
    state: $preview ? CANVAS_DRAFT_STATE : CANVAS_PUBLISHED_STATE,
  });

const navLinks = compositions
  .filter((c) => c.composition._slug)
  .map((c) => {
    return {
      title: c.composition._name,
      url: c.composition._slug ?? '#',
    };
  });
</script>

<template>
  <PageComposition :composition="data.composition" :navLinks="navLinks" />
</template>
