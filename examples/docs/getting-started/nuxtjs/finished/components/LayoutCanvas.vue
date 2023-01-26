<script lang="ts" setup>
import Footer from "./Footer.vue";

defineProps<{ title: string }>();
</script>

<template>
  <div class="container">
    <Head>
      <Title>{{ title }}</Title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <UniformSlot name="body" />
    <Footer />
  </div>
</template>
