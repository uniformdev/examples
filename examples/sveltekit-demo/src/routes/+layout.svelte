<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import Header from '$lib/components/header.svelte';
  import Footer from '$lib/components/footer.svelte';
  
  let { children } = $props();

  // Only use dark hero mode on homepage
  const isHomepage = $derived($page.url.pathname === '/');
</script>

<div class="min-h-screen flex flex-col">
  <Header darkHero={isHomepage} />
  <main class="flex-1">
    {@render children()}
  </main>
  <Footer />
</div>
