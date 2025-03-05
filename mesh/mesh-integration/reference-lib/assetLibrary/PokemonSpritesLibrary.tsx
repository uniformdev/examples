import React, { useEffect } from "react";
import {
  ObjectGridItem,
  ObjectGridItemCoverButton,
  ObjectGridItemHeading,
} from "@uniformdev/design-system";

export type PokemonImage = {
  name: string;
  url: string;
  width: number;
  height: number;
};

export type PockemonLibraryMetadata = {
  limit: number;
};

export const PokemonSpritesLibrary = ({
  onAssetSelect,
  metadata,
}: {
  metadata: PockemonLibraryMetadata;
  onAssetSelect?: (asset: PokemonImage) => void;
}) => {
  const assets = usePockemonAssets(metadata);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "var(--spacing-base)",
        padding: "var(--spacing-base)",
      }}
    >
      {assets.map((asset) => (
        <ObjectGridItem
          key={asset.name}
          header={
            <ObjectGridItemHeading
              data-testid="card-title"
              heading={asset.name}
              tooltip={asset.name}
            />
          }
          cover={
            <ObjectGridItemCoverButton
              id={asset.url}
              imageUrl={asset.url}
              onSelection={() => onAssetSelect?.(asset)}
            />
          }
          onClick={() => onAssetSelect?.(asset)}
        />
      ))}
    </div>
  );
};

const usePockemonAssets = (metadata: PockemonLibraryMetadata) => {
  const [assets, setAssets] = React.useState<PokemonImage[]>([]);

  useEffect(() => {
    const fetchAssets = async () => {
      const pokemonListResponse = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${metadata.limit}`
      );
      const pokemonList = await pokemonListResponse.json();

      const pokemonAssets: PokemonImage[] = await Promise.all(
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
              width: 96,
              height: 96,
            };
          }
        )
      );

      setAssets(pokemonAssets);
    };

    fetchAssets();
  }, []);

  return assets;
};
