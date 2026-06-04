import {
  type ComponentParameter,
  type EntryData,
  parseVariableExpression,
  type RootComponentInstance,
  walkNodeTree,
} from '@uniformdev/canvas';
import { Button, Callout, InputSelect, VerticalRhythm } from '@uniformdev/design-system';
import { type EditorStateApi, useMeshLocation } from '@uniformdev/mesh-sdk-react';
import { useCallback, useState } from 'react';

/*
  Example of a canvaseditor tool to perform machine translation.
  This is a placeholder implementation that simulates a machine translation service.
  In a real-world scenario, you would use a machine translation API to translate the values.
  This implementation is not production-ready and is only meant as an example.
*/

type TranslationProgress = {
  nodeType: string;
  property: string;
  conditionIndex: number;
  sourceValue: unknown;
  count: number;
};

type TranslationStatus = 'idle' | 'translating' | 'done';

/**
 * Checks if a string is purely a dynamic token bind expression with no static text.
 * Uses the canvas parseVariableExpression to detect if the entire value is a single variable reference.
 */
function isPureBindExpression(value: string): boolean {
  let hasText = false;
  let variableCount = 0;

  parseVariableExpression(value, (_, type) => {
    if (type === 'text') {
      hasText = true;
    } else if (type === 'variable') {
      variableCount++;
    }
  });

  // It's a pure bind expression if there's exactly one variable and no text tokens
  return variableCount === 1 && !hasText;
}

/**
 * Placeholder translate function that prefixes string values with the target locale.
 * Includes an artificial 1s delay to simulate real translation.
 */
async function placeholderTranslate(value: unknown, targetLocale: string): Promise<unknown> {
  // Artificial 1s delay to simulate async translation
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (typeof value === 'string') {
    if (isPureBindExpression(value)) {
      return value;
    }

    return `in ${targetLocale} (mocked): ${value}`;
  }

  // FUTURE ENHANCEMENT: translate other value types, e.g. rich text, image alt text, etc

  // Skip unknown value types
  return value;
}

/**
 * Processes a single property value and translates it if needed.
 */
async function translatePropertyValue(
  editorState: EditorStateApi,
  nodeId: string,
  propertyName: string,
  propertyType: string,
  sourceValue: unknown,
  conditionIndex: number,
  hasSourceLocaleValue: boolean,
  targetLocale: string
): Promise<void> {
  // Only select the component/parameter if it has a value in the source locale
  if (hasSourceLocaleValue) {
    await editorState.setSelectedNodeId({ nodeId });
    await editorState.setSelectedParameterId({ parameterId: propertyName });
  }

  // Translate the value
  const translatedValue = await placeholderTranslate(sourceValue, targetLocale);

  // Update the property with the translated value in the target locale
  await editorState.updateNodeProperty({
    nodeId,
    property: propertyName,
    value: translatedValue,
    type: propertyType,
    locale: targetLocale,
    conditionIndex,
  });
}

/**
 * Processes a single property (parameter or field) and translates all its values.
 */
async function processProperty(
  editorState: EditorStateApi,
  nodeId: string,
  nodeType: string,
  propertyName: string,
  property: ComponentParameter,
  sourceLocale: string | undefined,
  targetLocale: string,
  onProgress: (progress: TranslationProgress) => void,
  countRef: { current: number }
): Promise<void> {
  // Skip block parameters (they contain nested components, not translatable values)
  if (property.type === 'block') {
    return;
  }

  // Process base value (from locales or invariant)
  let sourceValue: unknown;
  let hasSourceLocaleValue = false;

  if (sourceLocale) {
    const localeValue = property.locales?.[sourceLocale];
    if (localeValue !== undefined) {
      sourceValue = localeValue;
      hasSourceLocaleValue = true;
    } else {
      sourceValue = property.value;
      hasSourceLocaleValue = false;
    }
  } else {
    sourceValue = property.value;
    hasSourceLocaleValue = false;
  }

  // Translate base value if it exists
  if (sourceValue !== undefined && sourceValue !== null && sourceValue !== '') {
    countRef.current++;
    onProgress({
      nodeType,
      property: propertyName,
      conditionIndex: -1,
      sourceValue,
      count: countRef.current,
    });

    await translatePropertyValue(
      editorState,
      nodeId,
      propertyName,
      property.type,
      sourceValue,
      -1,
      hasSourceLocaleValue,
      targetLocale
    );
  }

  // Process conditional values (from localesConditions )
  const conditions = property.localesConditions?.[sourceLocale ?? ''];

  if (conditions) {
    for (let i = 0; i < conditions.length; i++) {
      const condition = conditions[i];
      if (condition.value !== undefined && condition.value !== null && condition.value !== '') {
        countRef.current++;
        onProgress({
          nodeType,
          property: propertyName,
          conditionIndex: i,
          sourceValue: condition.value,
          count: countRef.current,
        });

        await translatePropertyValue(
          editorState,
          nodeId,
          propertyName,
          property.type,
          condition.value,
          i,
          sourceLocale !== undefined,
          targetLocale
        );
      }
    }
  }
}

/**
 * Walks the tree and translates all values as they are discovered.
 */
async function translateTree(
  tree: RootComponentInstance | EntryData,
  editorState: EditorStateApi,
  sourceLocale: string | undefined,
  targetLocale: string,
  onProgress: (progress: TranslationProgress) => void
): Promise<number> {
  // Check enabled locales from root node
  const enabledLocales: string[] = tree._locales ?? [];

  // Only enable the target locale if it's not already enabled
  if (!enabledLocales.includes(targetLocale)) {
    await editorState.enableLocale({ locale: targetLocale });
  }

  // Switch to the target locale in the editor UI
  await editorState.setCurrentLocale({ locale: targetLocale });

  const countRef = { current: 0 };

  // Collect all nodes first (walkNodeTree is synchronous)
  const nodes: Array<{
    type: 'component' | 'entry';
    nodeId: string;
    nodeType: string;
    properties: Record<string, ComponentParameter>;
  }> = [];

  walkNodeTree(tree, ({ type, node }) => {
    if (type === 'component') {
      const nodeId = node._id;
      if (nodeId) {
        nodes.push({ type: 'component', nodeId, nodeType: node.type, properties: node.parameters ?? {} });
      }
    } else if (type === 'entry') {
      const nodeId = node._id;
      if (nodeId) {
        nodes.push({ type: 'entry', nodeId, nodeType: node.type, properties: node.fields ?? {} });
      }
    }
  });

  // Process each node's properties
  for (const nodeInfo of nodes) {
    for (const [propertyName, property] of Object.entries(nodeInfo.properties)) {
      await processProperty(
        editorState,
        nodeInfo.nodeId,
        nodeInfo.nodeType,
        propertyName,
        property,
        sourceLocale,
        targetLocale,
        onProgress,
        countRef
      );
    }
  }

  return countRef.current;
}

const TranslationTool = () => {
  const { metadata, editorState } = useMeshLocation('canvasEditorTools');

  const [sourceLocale, setSourceLocale] = useState<string>(metadata.currentLocale || '');
  const [targetLocale, setTargetLocale] = useState<string>('');
  const [status, setStatus] = useState<TranslationStatus>('idle');
  const [progress, setProgress] = useState<TranslationProgress | null>(null);
  const [totalTranslated, setTotalTranslated] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const allLocaleOptions = [
    { label: 'Select one...', value: '' },
    ...metadata.locales.map((l) => ({ label: l.displayName, value: l.locale })),
  ];

  const canTranslate = targetLocale && sourceLocale !== targetLocale;

  const handleTranslate = useCallback(async () => {
    if (!canTranslate) {
      return;
    }

    setStatus('translating');
    setError(null);
    setProgress(null);
    setTotalTranslated(0);

    try {
      const tree = await editorState.exportTree();
      const count = await translateTree(
        tree,
        editorState,
        sourceLocale || undefined,
        targetLocale,
        setProgress
      );
      setTotalTranslated(count);
      setProgress(null);
      setStatus('done');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setError(e instanceof Error ? e.message : 'Translation failed');
      setStatus('idle');
    }
  }, [editorState, sourceLocale, targetLocale, canTranslate]);

  const handleReset = useCallback(() => {
    setStatus('idle');
    setProgress(null);
    setTotalTranslated(0);
    setError(null);
  }, []);

  const sourceLocaleDisplay = sourceLocale
    ? metadata.locales.find((l) => l.locale === sourceLocale)?.displayName || sourceLocale
    : '(invariant)';
  const targetLocaleDisplay = targetLocale
    ? metadata.locales.find((l) => l.locale === targetLocale)?.displayName || targetLocale
    : '';

  return (
    <VerticalRhythm gap="lg" style={{ padding: 'var(--spacing-sm)' }}>
      {error && <div>{error}</div>}

      {status === 'idle' && (
        <VerticalRhythm>
          <InputSelect
            id="source-locale"
            label="Translate from:"
            name="sourceLocale"
            value={sourceLocale}
            onChange={(e) => setSourceLocale(e.target.value)}
            options={allLocaleOptions}
          />

          <InputSelect
            id="target-locale"
            label="Translate to:"
            name="targetLocale"
            value={targetLocale}
            onChange={(e) => setTargetLocale(e.target.value)}
            options={allLocaleOptions}
          />

          <Button buttonType="secondary" disabled={!canTranslate} onClick={handleTranslate}>
            Start Translation
          </Button>
        </VerticalRhythm>
      )}

      {status === 'translating' && (
        <VerticalRhythm gap="base">
          <div>
            <strong>Translating from</strong> {sourceLocaleDisplay} <strong>to</strong> {targetLocaleDisplay}
          </div>

          <div>Translated: {progress?.count ?? 0} values</div>

          {progress && (
            <div>
              <VerticalRhythm gap="xs">
                <div>
                  <strong>Translating:</strong>
                </div>
                <div>
                  Node: <code>{progress.nodeType}</code>
                </div>
                <div>
                  Property: <code>{progress.property}</code>
                  {progress.conditionIndex >= 0 && <span> [condition {progress.conditionIndex}]</span>}
                </div>
                <div>
                  {typeof progress.sourceValue === 'string'
                    ? `"${progress.sourceValue.substring(0, 100)}${progress.sourceValue.length > 100 ? '...' : ''}"`
                    : `(${typeof progress.sourceValue})`}
                </div>
              </VerticalRhythm>
            </div>
          )}
        </VerticalRhythm>
      )}

      {status === 'done' && (
        <VerticalRhythm gap="base">
          <Callout type="success" title="Translation complete!">
            Translated {totalTranslated} values to {targetLocaleDisplay}.
          </Callout>

          <Button buttonType="secondary" onClick={handleReset}>
            Translate again
          </Button>
        </VerticalRhythm>
      )}
    </VerticalRhythm>
  );
};

export default TranslationTool;
