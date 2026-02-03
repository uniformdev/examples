<script lang="ts">
	import { UniformSlot } from '@uniformdev/canvas-svelte';
	import type { ComponentProps } from '@uniformdev/canvas-svelte';

	interface Props extends ComponentProps<{ maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full' }> {}

	let { maxWidth = 'lg', component }: Props = $props();
</script>

<div class="container" class:sm={maxWidth === 'sm'} class:md={maxWidth === 'md'} class:lg={maxWidth === 'lg'} class:xl={maxWidth === 'xl'} class:full={maxWidth === 'full'}>
	<UniformSlot name="content" />
</div>

<style>
	.container {
		width: 100%;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.sm { max-width: 640px; }
	.md { max-width: 768px; }
	.lg { max-width: 1024px; }
	.xl { max-width: 1280px; }
	.full { max-width: 100%; }
</style>
