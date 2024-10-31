<script lang="ts" setup>
import type { RootComponentInstance } from "@uniformdev/canvas";
import { resolveRenderer } from "./canvasComponents";
import type { Props as NavigationProps } from "./Navigation.vue";

interface Props {
  composition: RootComponentInstance;
  navLinks: NavigationProps["navLinks"];
}

const props = defineProps<Props>();

const { composition } = props;
const { metaTitle } = composition?.parameters || {};
const title = metaTitle?.value as string;
</script>

<template>
  <div class="page">
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <Navigation :navLinks="navLinks" />
    <UniformComposition
      :data="composition"
      :resolveRenderer="resolveRenderer"
    />
    <Footer />
  </div>
</template>

<style scoped>
.page {
  min-height: 20vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}
</style>
