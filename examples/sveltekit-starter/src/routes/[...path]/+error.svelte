<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="error-page">
	<h1>{$page.status}</h1>
	<p>{$page.error?.message || 'Page not found'}</p>
	<a href="/">← Back to home</a>
</div>

<style>
	.error-page {
		min-height: 80vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 2rem;
	}

	h1 {
		font-size: 6rem;
		margin: 0;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	p {
		font-size: 1.25rem;
		color: #64748b;
		margin: 1rem 0 2rem;
	}

	a {
		color: #667eea;
		text-decoration: none;
		font-weight: 500;
	}

	a:hover {
		text-decoration: underline;
	}
</style>
