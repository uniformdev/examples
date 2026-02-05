<script lang="ts">
  import { UniformSlot } from '@uniformdev/canvas-svelte';
  import type { ComponentProps } from '@uniformdev/canvas-svelte';

  interface Props extends ComponentProps<{}> {}

  let {}: Props = $props();
</script>

<!-- Page composition - renders the content slot -->
<UniformSlot name="content" />
