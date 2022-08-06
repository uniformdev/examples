<script lang="ts" setup>
import type { Content } from "../types";

const props = defineProps<{ content: Content }>();
const links = computed(() => props.content.filter((c) => c.url));
</script>
<template>
  <div>
    <span v-for="(link, i) in links">
      {{ i > 0 ? " :: " : null }}
      <NuxtLink :href="link.url">{{ link.fields.title }}</NuxtLink>
    </span>
  </div>
</template>
