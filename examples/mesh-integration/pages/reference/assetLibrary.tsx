import { useMeshLocation } from "@uniformdev/mesh-sdk-react";
import React from "react";

import { PokemonSpritesLibrary } from '../../reference-lib/assetLibrary/PokemonSpritesLibrary';

/**
 * This is an example of how to use external asset library location.
 *
 * It is meant to be used on Assets experience page.
 * You can find more information about Asset Parameter here: https://docs.uniform.app/docs/guides/composition/manage-assets
 *
 * This location receives following props from Mesh SDK:
 *  - metadata - any additional metadata for this integration and current parameter in Canvas.
 *    Usually it keeps global integration settings with credentials or global configurations like Root Folder you'd want your DAM to open
 *
 *  Main task of this component would be to render your external asset library to manage your asset via Uniform Platform
 */
const AssetLibrary = () => {
  const { metadata } = useMeshLocation("assetLibrary");

  // metadata.settings contains global integration settings
  // it can be undefined because it is lazy loaded
  const pockemonIntegrationSettings = metadata.settings as { apiSecret: string; containerId: string; assetsPerPage: number } | undefined;

  const pockemonAssetsMetadata = {
    limit: pockemonIntegrationSettings?.assetsPerPage ?? 20,
    apiSecret: pockemonIntegrationSettings?.apiSecret,
    containerId: pockemonIntegrationSettings?.containerId,
    ...metadata,
  };

  return (
    <div>
      <h2>Current metadata</h2>
      <pre>{JSON.stringify(pockemonAssetsMetadata)}</pre>
      <PokemonSpritesLibrary
        metadata={pockemonAssetsMetadata}
      />
    </div>
  );
};
export default AssetLibrary;
