<script lang="ts">
	import { UniformText } from '@uniformdev/canvas-svelte';
	import type { ComponentProps } from '@uniformdev/canvas-svelte';

	interface Props extends ComponentProps<{ title?: string; description?: string; image?: string; link?: string }> {}

	let { title, description, image, link, component }: Props = $props();

	const isFeatured = $derived(component.variant === 'featured');
</script>

<article class="card" class:featured={isFeatured}>
	{#if image}
		<img src={image} alt={title ?? ''} class="card-image" />
	{/if}
	<div class="card-content">
		<h3>
			<UniformText parameterId="title" as="span" />
			{#if isFeatured}
				<span class="badge">Featured</span>
			{/if}
		</h3>
		{#if description}
			<p>
				<UniformText parameterId="description" as="span" />
			</p>
		{/if}
		{#if link}
			<a href={link} class="card-link">Learn more →</a>
		{/if}
	</div>
</article>

<style>
	.card {
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 12px;
		overflow: hidden;
		transition: box-shadow 0.2s, transform 0.2s;
	}

	.card:hover {
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
		transform: translateY(-2px);
	}

	.card.featured {
		border-color: #667eea;
		border-width: 2px;
	}

	.card-image {
		width: 100%;
		height: 200px;
		object-fit: cover;
	}

	.card-content {
		padding: 1.5rem;
	}

	h3 {
		margin: 0 0 0.75rem 0;
		font-size: 1.25rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.badge {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 500;
	}

	p {
		margin: 0 0 1rem 0;
		color: #64748b;
		line-height: 1.6;
	}

	.card-link {
		color: #667eea;
		text-decoration: none;
		font-weight: 500;
	}

	.card-link:hover {
		text-decoration: underline;
	}
</style>
