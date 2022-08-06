<script lang="ts" setup>
import content from "../content/content.json";
import doEnhance from "../lib/enhancer";
import resolveRenderer from "../lib/resolveRenderer";
import LayoutCanvas from "../components/LayoutCanvas.vue";

const slug = "/";
const topic = content.find((e) => e.url == slug);

const { $useComposition } = useNuxtApp();
const { data: compositionData } = await $useComposition({ slug });

const composition = await doEnhance(compositionData.value.composition);
</script>

<template>
  <Composition
    v-if="composition"
    :data="composition"
    :resolve-renderer="resolveRenderer"
  >
    <LayoutCanvas :title="topic.fields.title" />
  </Composition>
</template>
