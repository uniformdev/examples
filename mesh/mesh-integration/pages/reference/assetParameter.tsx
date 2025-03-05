import { AssetParamValueItem, useMeshLocation } from '@uniformdev/mesh-sdk-react';
import { v4 } from 'uuid';
import React from 'react';

import { PokemonImage, PokemonSpritesLibrary } from '../../reference-lib/assetLibrary/PokemonSpritesLibrary';

/**
 * This is an example of how to use external asset parameter location.
 *
 * It is meant to be used inside Asset Parameter in Uniform Canvas.
 * You can find more information about Asset Parameter here: https://docs.uniform.app/docs/guides/composition/manage-assets
 *
 * This location receives following props from Mesh SDK:
 *  - metadata - any additional metadata for this integration and current parameter in Canvas.
 *    Usually it keeps global integration settings with credentials or global configurations like Root Folder you'd want your DAM to open
 *
 *  - setValue - a function to modify current asset parameter value. Considering that Asset Parameter is a multi-value parameter,
 *    you would append a new asset to the array of current assets.
 *
 *  - value - current value of the parameter. It is an array of assets.
 *
 *  Main task of this component would be to render your external asset library and provide a way to select assets from it.
 *  On new asset(s) selection you would need to call setValue function to update current value of the parameter.
 *  You would need to create a mapping function to transform your asset to Uniform Asset format.
 *  Check "mapPockemonSpriteToUniformAsset" function below.
 */
const AssetParameter = () => {
  const { metadata, setValue, value } = useMeshLocation("assetParameter");

  // metadata.settings contains global integration settings
  // it can be undefined because it is lazy loaded
  const pockemonIntegrationSettings = metadata.settings as { apiSecret: string; containerId: string; assetsPerPage: number } | undefined;

  const pockemonAssetsMetadata = {
    limit: pockemonIntegrationSettings?.assetsPerPage ?? 20,
    apiSecret: pockemonIntegrationSettings?.apiSecret,
    containerId: pockemonIntegrationSettings?.containerId,
    maxAssetsToSelect: metadata.maxAssets,
    ...metadata,
  };

  return (
    <div>
      <h2>Current metadata</h2>
      <pre>{JSON.stringify(pockemonAssetsMetadata)}</pre>
      <h2>Current selected assets</h2>
      <pre>{JSON.stringify(value)}</pre>
      <PokemonSpritesLibrary
        onAssetSelect={(asset) => {
          setValue((prevValue) => ({
            newValue: [
              ...prevValue,
              mapPockemonSpriteToUniformAsset(asset),
            ],
          }));
        }}
        metadata={pockemonAssetsMetadata}
      />
    </div>
  );
};


const mapPockemonSpriteToUniformAsset = (asset: PokemonImage): AssetParamValueItem => {
  return {
    type: 'image',
    _id: v4(),
    _source: 'integration-reference',
    fields: {
      url: {
        type: 'text',
        value: asset.url,
      },
      title: {
        type: 'text',
        value: asset.name,
      },
      width: {
        type: 'number',
        value: asset.width,
      },
      height: {
        type: 'number',
        value: asset.height,
      }
    }
  }
}

export default AssetParameter;
