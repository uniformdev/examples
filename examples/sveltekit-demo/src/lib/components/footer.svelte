<script lang="ts">
  import { categories } from "$lib/data/products";
</script>

<footer class="bg-foreground text-primary-foreground">
  <div class="max-w-6xl mx-auto px-6 py-16">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
      <!-- Products -->
      <div>
        <h4 class="font-semibold mb-4 text-sm">Shop</h4>
        <ul class="space-y-3">
          {#each categories as category}
            <li>
              <a href="/products/{category.slug}" class="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                {category.name}
              </a>
            </li>
          {/each}
          <li>
            <a href="/" class="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Accessories
            </a>
          </li>
        </ul>
      </div>
      
      <!-- Services -->
      <div>
        <h4 class="font-semibold mb-4 text-sm">Services</h4>
        <ul class="space-y-3">
          <li><a href="/" class="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Cherry Care+</a></li>
          <li><a href="/" class="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Trade In</a></li>
          <li><a href="/" class="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Financing</a></li>
          <li><a href="/" class="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Order Status</a></li>
        </ul>
      </div>
      
      <!-- Company -->
      <div>
        <h4 class="font-semibold mb-4 text-sm">Company</h4>
        <ul class="space-y-3">
          <li><a href="/" class="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">About Cherry</a></li>
          <li><a href="/" class="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Careers</a></li>
          <li><a href="/" class="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Newsroom</a></li>
          <li><a href="/" class="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Investors</a></li>
        </ul>
      </div>
      
      <!-- Support -->
      <div>
        <h4 class="font-semibold mb-4 text-sm">Support</h4>
        <ul class="space-y-3">
          <li><a href="/" class="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Contact Us</a></li>
          <li><a href="/" class="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Get Help</a></li>
          <li><a href="/" class="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Community</a></li>
          <li><a href="/" class="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Developer</a></li>
        </ul>
      </div>
    </div>
    
    <!-- Bottom bar -->
    <div class="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
      <div class="flex items-center gap-2.5">
        <svg viewBox="0 0 32 32" class="w-6 h-6" fill="none">
          <!-- Left cherry -->
          <circle cx="10" cy="22" r="8" fill="url(#cherryGradientFooterL)" />
          <ellipse cx="7" cy="19" rx="2" ry="2.5" fill="white" opacity="0.35" />
          <!-- Right cherry -->
          <circle cx="22" cy="24" r="7" fill="url(#cherryGradientFooterR)" />
          <ellipse cx="19.5" cy="21.5" rx="1.5" ry="2" fill="white" opacity="0.3" />
          <!-- Stems -->
          <path d="M10 14 C10 8, 14 4, 18 3 M22 17 C22 12, 20 6, 18 3" stroke="hsl(25, 40%, 30%)" stroke-width="1.5" stroke-linecap="round" fill="none" />
          <!-- Leaf -->
          <path d="M18 3 C20 1, 24 1, 26 3 C24 5, 20 5, 18 3" fill="hsl(130, 50%, 38%)" />
          <defs>
            <linearGradient id="cherryGradientFooterL" x1="2" y1="14" x2="18" y2="30" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="hsl(355, 90%, 62%)" />
              <stop offset="60%" stop-color="hsl(350, 85%, 48%)" />
              <stop offset="100%" stop-color="hsl(345, 80%, 35%)" />
            </linearGradient>
            <linearGradient id="cherryGradientFooterR" x1="15" y1="17" x2="29" y2="31" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="hsl(355, 88%, 58%)" />
              <stop offset="60%" stop-color="hsl(350, 82%, 45%)" />
              <stop offset="100%" stop-color="hsl(345, 78%, 32%)" />
            </linearGradient>
          </defs>
        </svg>
        <span class="text-sm text-primary-foreground/60">Cherry Inc. 2030. All rights reserved.</span>
      </div>
      
      <div class="flex items-center gap-6">
        <a href="/" class="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Privacy</a>
        <a href="/" class="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Terms</a>
        <a href="/" class="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Sitemap</a>
      </div>
    </div>
  </div>
</footer>
