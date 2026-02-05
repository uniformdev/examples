<script lang="ts">
  interface Props {
    headline: string;
    description: string;
    placeholder: string;
    buttonText: string;
    disclaimer: string;
  }

  let {
    headline,
    description,
    placeholder,
    buttonText,
    disclaimer
  }: Props = $props();
</script>

<!-- Newsletter / CTA -->
<section class="py-24 md:py-32">
  <div class="max-w-3xl mx-auto px-6 text-center">
    <div class="w-16 h-16 mx-auto mb-8 rounded-full bg-gradient-to-br from-accent to-[hsl(350,70%,65%)] flex items-center justify-center">
      <svg class="w-8 h-8 text-accent-foreground" viewBox="0 0 24 24" fill="none">
        <!-- Left cherry -->
        <circle cx="8" cy="17" r="5.5" fill="currentColor" />
        <!-- Right cherry -->
        <circle cx="16" cy="18" r="5" fill="currentColor" />
        <!-- Stems -->
        <path d="M8 11.5 C8 7, 11 4, 14 3 M16 13 C16 9, 15 5, 14 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
        <!-- Leaf -->
        <path d="M14 3 C15.5 1.5, 18 1.5, 19.5 3 C18 4.5, 15.5 4.5, 14 3" fill="currentColor" />
      </svg>
    </div>
    <h2 class="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
      {headline}
    </h2>
    <p class="text-muted-foreground mb-8 max-w-xl mx-auto">
      {description}
    </p>
    <form class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input 
        type="email" 
        placeholder={placeholder}
        class="flex-1 px-6 py-4 rounded-full bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
      />
      <button 
        type="submit"
        class="px-8 py-4 bg-foreground text-background rounded-full font-medium hover:bg-foreground/90 transition-colors"
      >
        {buttonText}
      </button>
    </form>
    <p class="text-xs text-muted-foreground mt-4">
      {disclaimer}
    </p>
  </div>
</section>
