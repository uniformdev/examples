<script lang="ts" setup>
import type { ComponentInstance } from "@uniformdev/canvas";

interface Props {
  title: string;
  description?: string;
  component: ComponentInstance;
}

defineProps<Props>();
</script>
<template>
  <div>
    <h1 class="title">{{ title }}</h1>
    <div class="description">
      <UniformRichText parameter-id="description" />
    </div>
  </div>
</template>

<style scoped>
.title a {
  color: #0070f3;
  text-decoration: none;
}

.title a:hover,
.title a:focus,
.title a:active {
  text-decoration: underline;
}

.title {
  color: #438fd5;
  margin: 0;
  line-height: 1.15;
  font-size: 4rem;
}

.title,
.description {
  text-align: center;
}

.description {
  margin: 1rem 0;
  line-height: 1.5;
  font-size: 1.5rem;
}
</style>
