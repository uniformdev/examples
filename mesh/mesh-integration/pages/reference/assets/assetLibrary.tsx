import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import {
  Button,
  ObjectGridContainer,
  ObjectGridItem,
  ObjectGridItemCoverButton,
  ObjectGridItemHeading,
} from '@uniformdev/design-system';
import { AssetLibraryLocationMetadata, AssetParamValue } from '@uniformdev/mesh-sdk';
import { LoadingIndicator, useUniformMeshSdk } from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';
import React, { useState } from 'react';

/**
 * This is an example of Asset Library component.
 *
 * Comparing to Asset parameter you do not need to provide onSelect handler.
 */

const AssetLibrary: NextPage = () => {
  const queryClient = new QueryClient();

  const sdk = useUniformMeshSdk();
  const [dialogResult, setDialogResult] = useState('');

  const openEditDialog = async () => {
    const dialog = await sdk.openLocationDialog<string>({
      locationKey: 'dialog',
      options: {
        width: 'medium',
        contentHeight: '50vh',
      },
    });
    if (dialog?.value) {
      setDialogResult(dialog.value);
    }
  };

  /**
   * Check assetLibraryDialog.tsx for the dialog implementation.
   */
  return (
    <QueryClientProvider client={queryClient}>
      <Button type="button" buttonType="secondary" onClick={openEditDialog}>
        Open dialog
      </Button>
      <div>
        Dialog Result: <i>{dialogResult || 'No dialog result yet'}</i>
      </div>
      <AssetLibraryInner />
    </QueryClientProvider>
  );
};

export const AssetLibraryInner = ({
  setAsset,
}: {
  isParam?: boolean;
  value?: AssetParamValue;
  setAsset?: (asset: PockemonSprite) => void;
  metadata?: AssetLibraryLocationMetadata;
}) => {
  const { data: pockemonAssets, isLoading } = usePockemonAssets();

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <ObjectGridContainer gridCount="auto-fill">
      {pockemonAssets?.map((asset) => {
        return (
          <ObjectGridItem
            key={asset.name}
            header={<ObjectGridItemHeading heading={asset.name} tooltip={asset.name} />}
            cover={
              <ObjectGridItemCoverButton
                id={asset.name}
                imageUrl={asset.url}
                alt={asset.name}
                onSelection={() => setAsset?.(asset)}
              />
            }
          >
            <span>{asset.url}</span>
          </ObjectGridItem>
        );
      })}
    </ObjectGridContainer>
  );
};

export type PockemonSprite = {
  url: string;
  name: string;
};

/**
 * Simple example query to fetch images from PokeAPI.
 */
export const usePockemonAssets = () => {
  return useQuery({
    queryKey: ['pockemon-assets'],
    queryFn: async () => {
      const pokemonListResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10');
      const pokemonList = await pokemonListResponse.json();

      const pokemonAssets: { name: string; url: string }[] = await Promise.all(
        pokemonList.results.map(async (pokemon: { name: string; url: string }) => {
          const pokemonResponse = await fetch(pokemon.url);
          const pokemonData = (await pokemonResponse.json()) as {
            name: string;
            sprites: { front_default: string };
          };
          return {
            name: pokemon.name,
            url: pokemonData.sprites.front_default,
          } as PockemonSprite;
        })
      );

      return pokemonAssets;
    },
  });
};

export default AssetLibrary;
