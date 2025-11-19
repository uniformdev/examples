<script lang="ts" setup>
// Explicitly import our custom composable to override the library's version
import { useUniformComposition } from "~/composables/useUniformComposition";

const route = useRoute();
const path = Array.isArray(route.params.path)
  ? `/${route.params.path.join("/")}`
  : `/${route.params.path}`;

const { composition, error } = await useUniformComposition({
  projectMapNodePath: path,
});
const { data: navLinks } = useUniformProjectMapNodes();

if (error?.value) {
  console.error("Error fetching composition from Uniform", error.value);
}
</script>

<template>
  <PageComposition
    v-if="composition"
    :composition="composition"
    :navLinks="navLinks ?? []"
  />
</template>
