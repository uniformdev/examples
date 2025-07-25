import { useMeshLocation } from '@uniformdev/mesh-sdk-react';

const CanvasEditorTools = () => {
  const { value, metadata } = useMeshLocation('canvasEditorTools');
  return (
    <div>
      <h2>{`Raw ${value.entityType} data`}</h2>
      <pre>{JSON.stringify(value)}</pre>
      <h3>Metadata</h3>
      <pre>{JSON.stringify(metadata)}</pre>
    </div>
  );
};

export default CanvasEditorTools;
