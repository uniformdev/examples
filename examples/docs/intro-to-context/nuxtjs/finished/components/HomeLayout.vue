<script lang="ts" setup>
import Body from "./Body.vue";
import Footer from "./Footer.vue";
import variantsJson from "../content/home-variants.json";
import { type PersonalizedVariant } from "@uniformdev/context";
import { Personalize } from "@uniformdev/context-vue";

defineProps<{ 
  fields: { 
    title: string; 
    description: string 
  } 
}>();
const variants = variantsJson as PersonalizedVariant[];
</script>

<template>
  <div class="container">
    <Head>
      <Title>{{ fields.title }}</Title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Personalize
      :variations="variants"
      name="bodyPersonalized"
      :component="(Body as any)"
    />
    <Footer />
  </div>
</template>
