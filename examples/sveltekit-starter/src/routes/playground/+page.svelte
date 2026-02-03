<script lang="ts">
	import { UniformComposition, UniformSlot } from '@uniformdev/canvas-svelte';
	import { componentMap } from '$lib/uniform/componentMap.js';
	import { EMPTY_COMPOSITION } from '@uniformdev/canvas';

	/**
	 * Playground page for previewing components and patterns in Canvas editor.
	 * This page receives composition data via contextual editing messages.
	 */
</script>

<div class="playground">
	<UniformComposition data={EMPTY_COMPOSITION} {componentMap}>
		<UniformSlot name="content" />
	</UniformComposition>
</div>

<style>
	.playground {
		min-height: 100vh;
		padding: 2rem;
	}
</style>
