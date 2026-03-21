import { type AfterAIDataResourceEditHookFn } from '@uniformdev/mesh-edgehancer-sdk';
import * as z from 'zod/mini';

const expectedResultSchema = z.object({
  Pokemon: z.string(),
});

/**
 * Simple example of an afterAIDataResourceEdit hook.
 */
const afterAIDataResourceEdit: AfterAIDataResourceEditHookFn = async ({ newValue, result, editRequest }) => {
  // If the AI edit already failed, return the failed result with current value
  if (!result.success) {
    return {
      success: false,
      newValue: editRequest.currentValue || {},
      summary: result.summary,
    };
  }

  const validatedResult = newValue ? expectedResultSchema.parse(newValue) : undefined;

  // EXAMPLE LOGIC: if the result pokemon is 'pikachu' then reject the edit
  if (validatedResult?.Pokemon === 'pikachu') {
    return {
      success: false,
      newValue: editRequest.currentValue || {},
      summary:
        'Edit rejected by example afterAIDataResourceEdit hook because Pikachu is not Poké-hipstery enough',
    };
  }

  // Accept the original edit result as-is
  return {
    ...result,
    newValue,
  };
};

export default afterAIDataResourceEdit;
