<script lang="ts" setup>

const route = useRoute();
const slug = `/${route.params.slug ?? ""}`;
const { composition, error } = await useUniformEnhancedComposition({ slug });
const navLinks = [{ url: "/", title: "Home" }];

if(error?.value) {
  console.error('Error fetching composition from Uniform', error.value);
}
</script>

<template>
  <PageComposition
    v-if="composition"
    :composition="composition"
    :navLinks="navLinks"
  />
</template>
