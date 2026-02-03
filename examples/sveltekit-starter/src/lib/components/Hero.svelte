<script lang="ts">
  import { UniformText, UniformRichText } from "@uniformdev/canvas-svelte";
</script>

<section class="hero">
  <UniformText parameterId="title" as="h1" placeholder="Enter hero title" />
  <div class="subtitle">
    <UniformRichText parameterId="description" as="div"placeholder="Enter hero description" />
  </div>
</section>

<style>
  .hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 4rem 2rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    text-align: center;
  }

  h1 {
    margin: 0 0 1rem 0;
    font-size: 2.5rem;
    font-weight: 700;
  }

  .subtitle {
    margin: 0 0 1.5rem 0;
    opacity: 0.9;
    font-size: 1.25rem;
  }
</style>
