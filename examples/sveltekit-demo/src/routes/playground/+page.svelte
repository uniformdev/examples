<script lang="ts">
  import { UniformComposition, UniformSlot } from '@uniformdev/canvas-svelte';
  import { componentMap } from '$lib/uniform/componentMap.js';
  import { EMPTY_COMPOSITION } from '@uniformdev/canvas';
</script>

<svelte:head>
  <title>Playground | Cherry</title>
</svelte:head>

<div class="playground">
  <UniformComposition data={EMPTY_COMPOSITION} {componentMap}>
    <UniformSlot name="content" />
  </UniformComposition>
</div>

<style>
  .playground {
    min-height: 100vh;
  }
</style>
