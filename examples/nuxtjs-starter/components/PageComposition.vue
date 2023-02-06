<script lang="ts" setup>
import type {
  ComponentInstance,
  RootComponentInstance,
} from "@uniformdev/canvas";
import { DefaultNotImplementedComponent } from "@uniformdev/canvas-vue";
import Hero from "./Hero.vue";

import type { Props as NavigationProps } from "./Navigation.vue";

// register your new components here
const componentResolver = (component: ComponentInstance) => {
  if (component.type == "hero") {
    return Hero;
  }
  return DefaultNotImplementedComponent;
};

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
      :resolveRenderer="componentResolver"
    >
      <UniformSlot name="content" />
    </UniformComposition>
    <Footer />
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
