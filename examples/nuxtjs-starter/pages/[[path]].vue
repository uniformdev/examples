<script lang="ts" setup>
import { getCompositionsForNavigation } from "@/lib/uniform/projectMap";

const route = useRoute();
const path = `/${route.params.path}`;
const { composition, error } = await useUniformEnhancedComposition({
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
