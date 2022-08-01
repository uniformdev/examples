<script lang="ts" setup>
import type { Fields } from "../types";
import content from "../content/content.json";
import Navigation from "./Navigation.vue";

defineProps<{ fields: Fields }>();
</script>

<template>
  <main class="main">
    <Navigation :content="content" />
    <h1 class="title">{{ fields.title }}</h1>
    <p class="description">{{ fields.description }}</p>
  </main>
</template>
