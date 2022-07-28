<script lang="ts" setup>
const router = useRouter();
const previewing = computed(() => Boolean(useNuxtApp().$preview));

const togglePreview = async () => {
  const query = router.currentRoute.value.query;
  if (previewing.value) {
    delete query.preview;
  } else {
    query.preview = "true";
  }

  await router.replace({
    path: router.currentRoute.value.path,
    query,
    force: true,
  });
  router.go(0);
};
</script>

<template>
  <Button @click="togglePreview" :active="previewing">
    {{ previewing ? "Turn preview off" : "Turn preview on" }}
  </Button>
</template>
