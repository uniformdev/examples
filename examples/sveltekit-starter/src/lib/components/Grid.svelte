<script lang="ts">
	import { UniformSlot } from '@uniformdev/canvas-svelte';
	import type { ComponentProps } from '@uniformdev/canvas-svelte';

	interface Props extends ComponentProps<{ columns?: number; gap?: string }> {}

	let { columns = 3, gap = '1.5rem', component }: Props = $props();
</script>

<div class="grid" style="--columns: {columns}; --gap: {gap};">
	<UniformSlot name="items" />
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(var(--columns, 3), 1fr);
		gap: var(--gap, 1.5rem);
	}

	@media (max-width: 768px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
