import { type CreateAIEditHookFn } from '@uniformdev/mesh-edgehancer-sdk';
import * as z from 'zod/mini';

const fauxColorParamConfigSchema = z.object({
  colorOptions: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    })
  ),
});

/**
 * This is an example of a createAIEdit hook.
 *
 * CreateAIEdit hooks are passed an AI edit request, and are responsible for returning:
 * - The expected output schema of the AI edit request (zod). Normally this is the shape of the value of your parameter type, however in concert with a afterAIEdit hook, you can use a different interstitial type and use the after hook to transform it to your parameter type.
 * - LLM editing instructions for your parameter type
 *
 * NOTE: we do not currently support defining tools for the edit request to utilize conditionally, so any dynamic data must be handed in the edit instructions/schema.
 *
 * NOTE: thrown exceptions in this hook will have their message sent to the LLM as the error message, and it will return a failed edit with a cleaned up error message.
 * If you run code that may throw an exception where you want to hide the message, use a try/catch block and re-throw a custom error.
 */
const createAIEdit: CreateAIEditHookFn = async ({ editRequest }) => {
  // example of a param type that stores a list of valid color options in its typeConfig object
  // (this can be any sort of dynamic options that your param type sets in its configuration UI)
  const config = fauxColorParamConfigSchema.safeParse(editRequest.propertyDefinition.typeConfig);
  if (!config.success || !config.data.colorOptions.length) {
    throw new Error('Invalid parameter config');
  }

  const { colorOptions } = config.data;

  const schema = z.object({
    // the schema expected to be returned by the LLM can be dynamic based on the type config, context, external requests, etc
    // the describe values are available to the LLM to help it understand the expected output
    color: z.enum(colorOptions.map((option) => option.value)),
  });

  // we also provide the serialized options so it can see the names not just the values (LLMs read serialized JSON just fine)
  const instructions = `You are choosing a color from a list of options. The options are: ${JSON.stringify(
    colorOptions
  )}`;

  // EXAMPLE LOGIC: If the edit prompt contains 'reject' then throw an error
  if (editRequest.edit.toLowerCase().includes('reject')) {
    throw new Error(
      'Edit rejected by example createAIEdit hook because the original edit prompt contained "reject"'
    );
  }

  return {
    outputJsonSchema: z.toJSONSchema(schema),
    instructions,
  };
};

export default createAIEdit;
