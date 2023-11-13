import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

import {
  AssetParamValueItem,
  LoadingIndicator,
  ScrollableList,
  ScrollableListItem,
  useMeshLocation,
} from "@uniformdev/mesh-sdk-react";
import type { NextPage } from "next";
import React from "react";

const AssetLibraryInner = () => {
  const { metadata, setValue, value } = useMeshLocation("assetLibrary");

  const [selectedAsset, setSelectedAsset] = React.useState<{
    name: string;
    url: string;
  } | null>(null);
  const { data: pockemonAssets, isLoading } = usePockemonAssets();

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div>
      <p>come one show me some content</p>
      <pre>{JSON.stringify(metadata)}</pre>
      <ScrollableList>
        {pockemonAssets?.map((asset) => (
          <ScrollableListItem
            active={selectedAsset?.url === asset.url}
            key={asset.name}
            icon={<img src={asset.url} alt={asset.name} />}
            buttonText={asset.name}
            onClick={() => {
              setSelectedAsset(asset);
              if (!value.find(({ url }) => url === asset.url)) {
                setValue((prev) => {
                  const newAsset: AssetParamValueItem = {
                    id: asset.url,
                    source: metadata.sourceId,
                    url: asset.url,
                    title: asset.name,
                    width: 96,
                    height: 96,
                  };
                  return {
                    newValue: [...prev, newAsset],
                  };
                });
              }
            }}
          />
        ))}
      </ScrollableList>
    </div>
  );
};

const usePockemonAssets = () => {
  return useQuery({
    queryKey: ["pockemon-assets"],
    queryFn: async () => {
      const pokemonListResponse = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=10"
      );
      const pokemonList = await pokemonListResponse.json();

      const pokemonAssets: { name: string; url: string }[] = await Promise.all(
        pokemonList.results.map(
          async (pokemon: { name: string; url: string }) => {
            const pokemonResponse = await fetch(pokemon.url);
            const pokemonData = (await pokemonResponse.json()) as {
              name: string;
              sprites: { front_default: string };
            };
            return {
              name: pokemon.name,
              url: pokemonData.sprites.front_default,
            };
          }
        )
      );

      return pokemonAssets;
    },
  });
};

const AssetLibrary: NextPage = () => {
  const queryClient = new QueryClient();

  // Provide the client to your App
  return (
    <QueryClientProvider client={queryClient}>
      <AssetLibraryInner />
    </QueryClientProvider>
  );
};
export default AssetLibrary;
