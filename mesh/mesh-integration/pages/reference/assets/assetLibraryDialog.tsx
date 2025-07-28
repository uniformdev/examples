import { Button, Input, VerticalRhythm } from '@uniformdev/design-system';
import { useMeshLocation } from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';
import React, { useState } from 'react';

/**
 * This is an example of a dialog component where you can handle single image operations for example, e.g. Adding new image, Editing, Cropping, etc if your external DAM allows it.
 * You can find how to open this dialog in the assetLibrary.tsx file.
 *
 * const openEditDialog = async () => {
 *   const dialog = await sdk.openLocationDialog<string>({
 *     locationKey: 'dialog',
 *     options: {
 *       width: 'medium',
 *       contentHeight: '50vh',
 *     },
 *   });
 *
 *   if (dialog?.value) {
 *     setDialogResult(dialog.value);
 *   }
 * };
 *
 * Note: You can also implement a dialog using just a modal component within <AssetLibrary /> component itself without using dialog SDK.
 */
const AssetLibraryDialog: NextPage = () => {
  const { dialogContext } = useMeshLocation();

  const [imageName, setImageName] = useState('');

  const onResult = (value: string) => {
    dialogContext?.returnDialogValue(`New image with path ${value} was added`);
  };

  return (
    <VerticalRhythm>
      <Input
        id="image"
        name="image"
        type="file"
        label="Upload new image"
        onChange={(e) => setImageName(e.target.value ?? '')}
      />
      <Button type="button" buttonType="secondary" onClick={() => onResult(imageName)}>
        Upload new image
      </Button>
    </VerticalRhythm>
  );
};

export default AssetLibraryDialog;
