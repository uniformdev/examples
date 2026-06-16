import {
  type EditorNode,
  type EditorNodeChildren,
  type EditorStateApi,
  useMeshLocation,
} from '@uniformdev/mesh-sdk-react';
import { useEffect, useState } from 'react';

type SlotViewerProps = {
  slotName: string;
  childIds: string[];
  editorState: EditorStateApi;
};

const SlotViewer = ({ slotName, childIds, editorState }: SlotViewerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <details
      open={isOpen}
      onToggle={(e) => e.target === e.currentTarget && setIsOpen((e.target as HTMLDetailsElement).open)}
      style={{ marginLeft: 8 }}
    >
      <summary>
        <em>{slotName}</em> (slot)
      </summary>
      {isOpen && childIds.map((id) => <NodeViewer key={id} nodeId={id} editorState={editorState} />)}
    </details>
  );
};

type NodeViewerProps = {
  nodeId: string;
  editorState: EditorStateApi;
};

const NodeViewer = ({ nodeId, editorState }: NodeViewerProps) => {
  const [node, setNode] = useState<EditorNode | null>(null);
  const [children, setChildren] = useState<EditorNodeChildren | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    editorState.getNodeById({ nodeId }).then((n) => setNode(n ?? null));
  }, [nodeId, editorState]);

  useEffect(() => {
    if (!isOpen) {
      setChildren(null);
      return;
    }
    editorState.getNodeChildren({ nodeId }).then((c) => setChildren(c ?? null));
  }, [isOpen, nodeId, editorState]);

  if (!node) return null;

  return (
    <details
      open={isOpen}
      onToggle={(e) => e.target === e.currentTarget && setIsOpen((e.target as HTMLDetailsElement).open)}
      style={{ marginLeft: 16 }}
    >
      <summary>
        <strong>{node.value.type}</strong>
      </summary>
      {isOpen &&
        children &&
        Object.entries(children).map(([slot, ids]) => (
          <SlotViewer key={slot} slotName={slot} childIds={ids} editorState={editorState} />
        ))}
    </details>
  );
};

const CanvasEditorTools = () => {
  const { value, metadata, editorState } = useMeshLocation('canvasEditorTools');
  const [rootId, setRootId] = useState<string | null>(null);

  useEffect(() => {
    editorState.getRootNodeId().then(setRootId);
  }, [editorState]);

  return (
    <div>
      <h3>Metadata</h3>
      <pre>{JSON.stringify(metadata)}</pre>

      <div>
        <h3>{value.entityType} data</h3>
        {rootId ? <NodeViewer nodeId={rootId} editorState={editorState} /> : <div>Loading root...</div>}
      </div>

      <h3>Set the Title property in en-US</h3>
      <input
        type="text"
        onChange={(e) => {
          if (!rootId) return;
          editorState.updateNodeProperty({
            nodeId: rootId,
            property: 'title',
            value: e.target.value,
            conditionIndex: -1,
            locale: 'en-US',
            type: 'text',
          });
        }}
      />
    </div>
  );
};

export default CanvasEditorTools;
