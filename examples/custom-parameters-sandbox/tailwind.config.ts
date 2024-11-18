import type { Config } from "tailwindcss";

const safelist = [
  // Text parameters
  { pattern: /text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/, variants: ['lg', 'md'] },
  { pattern: /font-(normal|medium|bold|extrabold)/, variants: ['lg', 'md'] },
  { pattern: /(uppercase|lowercase|capitalize)/, variants: ['lg', 'md'] },
  { pattern: /(underline|overline|line-through)/, variants: ['lg', 'md'] },
  { pattern: /tracking-(tighter|tight|normal|wide|wider|widest)/, variants: ['lg', 'md'] },
  { pattern: /text-(left|center|right)/ },
  // Flex parameters
  { pattern: /flex-(col|row|col-reverse|row-reverse)/, variants: ['lg', 'md'] },
  { pattern: /justify-(normal|start|end|center|between|around|evenly|stretch)/, variants: ['lg', 'md'] },
  { pattern: /gap(?:-(x|y))?-(0(\.5)?|1(\.5)?|2(\.5)?|3(\.5)?|[1-9]?[0-9]|px)/, variants: ['lg', 'md'] },
  { pattern: /items-(start|end|center|baseline|stretch)/, variants: ['lg', 'md'] },

]

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  safelist,
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
