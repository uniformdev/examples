<script lang="ts">
	import { UniformComposition, UniformSlot } from '@uniformdev/canvas-svelte';
	import { componentMap } from '$lib/uniform/componentMap.js';

	let { data } = $props();
</script>

<UniformComposition
	data={data.data}
	{componentMap}
	matchedRoute={data.matchedRoute}
	dynamicInputs={data.dynamicInputs}
>
	<UniformSlot name="content" />
</UniformComposition>
