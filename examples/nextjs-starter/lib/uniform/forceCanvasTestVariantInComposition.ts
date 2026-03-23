import {
  CANVAS_TEST_SLOT,
  CANVAS_TEST_TYPE,
  CANVAS_TEST_VARIANT_PARAM,
  type RootComponentInstance,
} from "@uniformdev/canvas";

/**
 * Canvas Page Router: force a specific test variation by skewing visitor
 * distributions on the composition payload before render.
 *
 * Matches the behavior described in Uniform’s Pages Router KB:
 * https://uniformdev.notion.site/How-to-force-a-specific-test-variant-for-all-A-B-tests-130763a2ed068089bdeeccc133c4f114
 *
 * - Only A/B test containers (`$test`) that include a variant whose Context tag
 *   `id` equals `forcedVariantId` are changed; other tests are left as-is.
 * - For those tests, the matching variant gets `testDistribution: 100`, siblings `0`.
 * - Call from `handleComposition` when not in preview, after the composition
 *   is loaded (see `pages/[[...slug]].tsx`).
 *
 * This differs from rewriting the `ufvd` cookie (App Router middleware recipe):
 * cookie rewriting affects stored variant assignments globally; this only
 * biases the random selection path when the visitor has no assignment yet for a test.
 */

type CanvasTreeNode = RootComponentInstance | CanvasChild;

type CanvasChild = NonNullable<
  NonNullable<RootComponentInstance["slots"]>[string]
>[number];

function isTestVariantTag(
  value: unknown
): value is { id?: string; testDistribution?: number } {
  return typeof value === "object" && value !== null;
}

function skewDistributionsOnTestNode(
  testNode: CanvasTreeNode,
  forcedVariantId: string
): void {
  const variants = testNode.slots?.[CANVAS_TEST_SLOT];
  if (!variants?.length) return;

  const hasForcedVariant = variants.some((v) => {
    const raw = v.parameters?.[CANVAS_TEST_VARIANT_PARAM]?.value;
    return (
      isTestVariantTag(raw) &&
      typeof raw.id === "string" &&
      raw.id === forcedVariantId
    );
  });
  if (!hasForcedVariant) return;

  for (const v of variants) {
    const param = v.parameters?.[CANVAS_TEST_VARIANT_PARAM];
    const raw = param?.value;
    if (!isTestVariantTag(raw) || typeof raw.id !== "string") continue;
    raw.testDistribution = raw.id === forcedVariantId ? 100 : 0;
  }
}

function walkCompositionTree(node: CanvasTreeNode, forcedVariantId: string): void {
  if (node.type === CANVAS_TEST_TYPE) {
    skewDistributionsOnTestNode(node, forcedVariantId);
  }
  const slots = node.slots;
  if (!slots) return;
  for (const children of Object.values(slots)) {
    for (const child of children ?? []) {
      walkCompositionTree(child, forcedVariantId);
    }
  }
}

export function applyForcedCanvasTestVariantDistributions(
  composition: RootComponentInstance | undefined | null,
  forcedVariantId: string | undefined | null
): void {
  if (!composition || !forcedVariantId) return;
  walkCompositionTree(composition, forcedVariantId);
}
