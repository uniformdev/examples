import { type CreateAIDataResourceEditHookFn } from '@uniformdev/mesh-edgehancer-sdk';
import * as z from 'zod/mini';

/**
 * Simple example of a createAIDataResourceEdit hook.
 *
 * This hook provides AI with instructions and schema for editing data resources.
 */
const createAIDataResourceEdit: CreateAIDataResourceEditHookFn = async () => {
  // The example data source in the playground lets you fetch from https://pokeapi.co/api/v2
  // So this example hook assumes you have a data type setup to fetch from https://pokeapi.co/api/v2/pokemon/${Pokemon},
  // and a "Pokemon" variable that is the pokeAPI id of the pokemon to fetch.

  // We fetch the list of allowed pokemon from the pokeAPI and let the LLM know the allowed values:
  const pokemonListResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=2000');
  const pokemonList = await pokemonListResponse.json();
  const validPokemonIds: string[] = pokemonList.results.map((pokemon: { name: string }) => pokemon.name);

  // Define the expected variables schema to be returned by the LLM
  // (must match what your data resource editor UI expects as variables input)
  const schema = z.object({
    Pokemon: z.enum(validPokemonIds),
  });

  // Teach AI how to edit your data resource (in this case, the schema defines the allowed pokemon ids, we don't need to repeat them)
  const instructions = `Set the Pokemon based on the edit instructions`;

  return {
    outputJsonSchema: z.toJSONSchema(schema),
    instructions,
  };
};

export default createAIDataResourceEdit;
