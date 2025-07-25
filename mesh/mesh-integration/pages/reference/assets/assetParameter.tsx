import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AssetParamValueItem } from '@uniformdev/mesh-sdk';
import { useMeshLocation } from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';
import React from 'react';
import { v4 as uuid } from 'uuid';

import { AssetLibraryInner, PockemonSprite } from './assetLibrary';

/**
 * This is an example of Asset Parameter component, that will be used in Uniform Canvas Editor to add, update, remove assets.
 *
 * The only difference between Parameter and Library components is selection of images you want to add to your content.
 */
const AssetParameter: NextPage = () => {
  const queryClient = new QueryClient();
  const { metadata, setValue } = useMeshLocation('assetParameter');

  const selectAsset = (asset: PockemonSprite) => {
    setValue((prev) => {
      return {
        newValue: [...prev, mapPockemonSpriteToUniformAsset(asset, metadata.sourceId)],
      };
    });
  };

  // Provide the client to your App
  return (
    <QueryClientProvider client={queryClient}>
      <AssetLibraryInner isParam setAsset={selectAsset} metadata={metadata} />
    </QueryClientProvider>
  );
};

const mapPockemonSpriteToUniformAsset = (asset: PockemonSprite, sourceId: string): AssetParamValueItem => {
  return {
    _id: uuid(),
    _source: sourceId,
    type: 'image',
    fields: {
      id: { type: 'text', value: asset.url },
      url: { type: 'text', value: asset.url },
      title: { type: 'text', value: asset.name },
      width: { type: 'number', value: 96 },
      height: { type: 'number', value: 96 },
    },
  };
};

export default AssetParameter;
