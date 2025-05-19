<script lang="ts" setup>
import { useUniformContextualEditingState } from "@uniformdev/canvas-vue";
const { isContextualEditing, selectedComponentReference, previewMode } =
  useUniformContextualEditingState();
const { context } = useNuxtApp().$useUniformContext();
const forgetMe = async () => {
  await context.forget(true);
};
console.log({ previewMode, isContextualEditing, selectedComponentReference });
</script>

<template>
  <p>Preview mode: {{ previewMode }}</p>
 
  <p>isContextualEditing: {{ isContextualEditing }}</p>

  <Button @click="forgetMe">Forget me {{ previewMode }}</Button>
</template>
