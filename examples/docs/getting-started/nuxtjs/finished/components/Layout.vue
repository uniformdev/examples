<script lang="ts" setup>
import type { Content, Fields } from "../types";
import Body from "./Body.vue";
import Footer from "./Footer.vue";

defineProps<{
  fields: Fields;
  content: Content;
}>();
</script>

<template>
  <div class="container">
    <Head>
      <Title>{{ fields.title }}</Title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Body :fields="fields" :content="content" />
    <Footer />
  </div>
</template>
