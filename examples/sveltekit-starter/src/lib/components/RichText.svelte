<script lang="ts">
	import type { ComponentProps } from '@uniformdev/canvas-svelte';

	interface Props extends ComponentProps<{ content?: string }> {}

	let { content, component }: Props = $props();

	// Note: UniformRichText from canvas-sveltekit needs the component prop
	// For now, we'll render the content directly
</script>

<div class="rich-text">
	{#if content}
		{@html content}
	{/if}
</div>

<style>
	.rich-text {
		line-height: 1.7;
		color: #374151;
	}

	.rich-text :global(h1),
	.rich-text :global(h2),
	.rich-text :global(h3) {
		margin-top: 1.5em;
		margin-bottom: 0.5em;
		color: #111827;
	}

	.rich-text :global(p) {
		margin-bottom: 1em;
	}

	.rich-text :global(a) {
		color: #667eea;
	}

	.rich-text :global(ul),
	.rich-text :global(ol) {
		padding-left: 1.5em;
		margin-bottom: 1em;
	}

	.rich-text :global(blockquote) {
		border-left: 4px solid #667eea;
		padding-left: 1rem;
		margin: 1.5em 0;
		font-style: italic;
		color: #64748b;
	}
</style>
