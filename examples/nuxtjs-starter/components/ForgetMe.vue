<script lang="ts" setup>
const { context } = useNuxtApp().$useUniformContext();
const forgetMe = async () => {
  await context.forget(true);
};
</script>

<template>
  <Button @click="forgetMe">Forget me</Button>
</template>
