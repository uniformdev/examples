/**
 * COMPONENT HELPERS - Reusable Component Utilities
 *
 * Common logic extracted from Uniform components to avoid duplication.
 * These utilities help with Canvas mode detection, access control, and more.
 *
 * WHY THIS EXISTS:
 * Without these helpers, every component would need to duplicate:
 * - Canvas mode detection logic
 * - Access type extraction and validation
 * - Access info mapping (icons, labels, colors)
 * - Authentication state retrieval
 *
 * By centralizing this logic, we ensure:
 * - Consistency across all components
 * - Single source of truth
 * - Easier testing and maintenance
 * - Reduced code duplication
 */

import { draftMode } from 'next/headers';
import type { CompositionContext } from '@uniformdev/next-app-router-shared';

/**
 * Canvas mode information
 */
export interface CanvasMode {
  isSecureCanvasMode: boolean;
  isContextualEditing: boolean;
  previewMode?: 'editor' | 'preview';
  canvasMode: string;
  modeIcon: string;
  modeColor: string;
}

/**
 * Access type information
 */
export interface AccessInfo {
  icon: string;
  label: string;
  color: string;
}

/**
 * Detect Canvas mode with security verification
 *
 * Combines Uniform's context flags with Next.js Draft Mode
 * for secure Canvas editor detection.
 *
 * @param context - Uniform composition context
 * @returns Canvas mode information
 *
 * @example
 * ```typescript
 * const canvasMode = await detectCanvasMode(context);
 * if (canvasMode.isSecureCanvasMode) {
 *   // Render Canvas editor UI
 * }
 * ```
 */
export async function detectCanvasMode({ pageState, isContextualEditing }: CompositionContext): Promise<CanvasMode> {
  const previewMode = pageState.previewMode;

  // SECURITY: Dual verification for Canvas mode
  // Draft Mode uses secure HTTP-only cookies set by preview API
  const { isEnabled: isDraftMode } = await draftMode();
  const isSecureCanvasMode = isContextualEditing && isDraftMode;

  // Determine the specific Canvas mode from Uniform's previewMode
  const canvasMode = previewMode === 'editor' ? 'Edit Mode' : previewMode === 'preview' ? 'Preview Mode' : 'View Mode';
  const modeIcon = previewMode === 'editor' ? '✏️' : previewMode === 'preview' ? '👁️' : '👀';
  const modeColor = previewMode === 'editor' ? 'from-blue-500 to-indigo-600' : 'from-purple-500 to-purple-700';

  return {
    isSecureCanvasMode,
    isContextualEditing,
    previewMode,
    canvasMode,
    modeIcon,
    modeColor,
  };
}
