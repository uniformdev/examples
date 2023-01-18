<script lang="ts" setup>

const route = useRoute();
const slug = `/${route.params.slug ?? ""}`;
const { composition } = await useUniformEnhancedComposition({ slug });
const navLinks = [{ url: "/", title: "Home" }];

</script>

<template>
  <PageComposition
    v-if="composition"
    :composition="composition"
    :navLinks="navLinks"
  />
</template>
