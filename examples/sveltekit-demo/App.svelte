<script lang="ts">
  import "./src/app.css";
  import Header from "./src/lib/components/header.svelte";
  import Footer from "./src/lib/components/footer.svelte";
  import HomePage from "./src/lib/pages/home-page.svelte";
  import CategoryPage from "./src/lib/pages/category-page.svelte";
  import ProductPage from "./src/lib/pages/product-page.svelte";

  // Simple hash-based routing
  let currentPath = $state(window.location.hash.slice(1) || "/");
  
  $effect(() => {
    const handleHashChange = () => {
      currentPath = window.location.hash.slice(1) || "/";
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  });

  // Parse route params
  const route = $derived.by(() => {
    if (currentPath === "/" || currentPath === "") {
      return { page: "home" };
    }
    
    const parts = currentPath.split("/").filter(Boolean);
    
    if (parts[0] === "products") {
      if (parts.length === 2) {
        return { page: "category", category: parts[1] };
      }
      if (parts.length === 3) {
        return { page: "product", category: parts[1], productId: parts[2] };
      }
    }
    
    return { page: "home" };
  });
</script>

<svelte:head>
  <title>ForgeTech Industries | Precision Manufacturing Equipment</title>
  <meta name="description" content="World-class CNC machines, cutting systems, and precision tools for industrial manufacturing." />
</svelte:head>

<div class="min-h-screen flex flex-col bg-background text-foreground">
  <Header darkHero={route.page === "home"} />
  <main class="flex-1">
    {#if route.page === "home"}
      <HomePage />
    {:else if route.page === "category"}
      <CategoryPage category={route.category || ""} />
    {:else if route.page === "product"}
      <ProductPage category={route.category || ""} productId={route.productId || ""} />
    {/if}
  </main>
  <Footer />
</div>
