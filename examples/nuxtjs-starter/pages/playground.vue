<script lang="ts" setup>
import { resolveRenderer } from "../components/canvasComponents";
</script>

<template>
  <UniformPlayground :resolveRenderer="resolveRenderer" />
</template>
