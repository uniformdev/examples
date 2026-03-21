import { type AfterAIEditHookFn } from '@uniformdev/mesh-edgehancer-sdk';
import * as z from 'zod/mini';

/**
 * This is an example of an afterAIEdit hook. AfterAIEdit hooks are called after a LLM has generated an edit using a createAIEdit hook.
 *
 * The afterAIEdit hook can be used to fail the edit, or apply transformations or business logic to the edit result.
 *
 * NOTE: thrown exceptions in this hook will have their message shown to users as-is.
 * If you run code that may throw an exception where you want to hide the message, use a try/catch block and re-throw a custom error.
 */
const afterAIEdit: AfterAIEditHookFn = async ({ result, newValue, editRequest }) => {
  // If the edit failed according to the LLM, return the failed result as-is
  if (!result.success) {
    return result;
  }

  const newValueAsColorSchema = newValue
    ? z
        .object({
          color: z.string(),
        })
        .parse(newValue)
    : undefined;

  // EXAMPLE LOGIC: Check if the new value is green and reject the edit if it is
  const GREEN_HEX = '#00ff00';
  if (newValueAsColorSchema?.color?.toLowerCase() === GREEN_HEX) {
    return {
      success: false,
      summary: `Edit rejected by example afterAIEdit hook because of resolved value ${GREEN_HEX}`,
    };
  }

  // EXAMPLE LOGIC: Check if the new value does not look like a valid hex color
  if (!newValueAsColorSchema?.color?.match(/^#([0-9a-f]{6})$/i)) {
    return {
      success: false,
      summary: `Edit rejected by example afterAIEdit hook because the value does not look like a valid hex color`,
    };
  }

  // ERROR HANDLING EXAMPLE: If the original edit prompt contained 'throw' then throw an error
  if (editRequest.edit.toLowerCase().includes('throw')) {
    throw new Error(
      'Edit rejected by example afterAIEdit hook because the original edit prompt contained "throw"'
    );
  }

  // Accept the original edit result as-is
  return {
    ...result,
    newValue,
  };
};

export default afterAIEdit;
