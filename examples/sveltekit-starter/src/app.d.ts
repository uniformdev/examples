import type { UniformPreviewData } from '@uniformdev/canvas-sveltekit';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      uniformPreview?: UniformPreviewData;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
