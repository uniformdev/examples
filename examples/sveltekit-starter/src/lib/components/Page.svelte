<script lang="ts">
	import { UniformSlot } from '@uniformdev/canvas-svelte';
	import type { ComponentProps } from '@uniformdev/canvas-svelte';

	interface Props extends ComponentProps<{ title?: string; description?: string }> {}

	let { title, description, component }: Props = $props();
</script>

<svelte:head>
	{#if title}
		<title>{title}</title>
	{/if}
	{#if description}
		<meta name="description" content={description} />
	{/if}
</svelte:head>

<main class="page">
	<UniformSlot name="content" />
</main>

<style>
	.page {
		min-height: 100vh;
		padding: 2rem;
	}
</style>
