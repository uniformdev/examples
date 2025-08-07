import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./request.ts'],
  format: ['esm'],
  target: 'es2020',
  platform: 'neutral',
  bundle: true,
  minify: true,
  clean: true,
  outDir: '../dist/edgehancer',
  external: ['@uniformdev/mesh-sdk'],
});