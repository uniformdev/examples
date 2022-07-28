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

const { metaTitle } = props.composition.parameters || {};
const title = metaTitle?.value as string;
</script>
<template>
  <div class="page">
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <Navigation :navLinks="navLinks" />
    <Composition :data="composition" :resolveRenderer="componentResolver">
      <SlotContent name="content" />
    </Composition>
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
