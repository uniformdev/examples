import { defineAutomation } from '@uniformdev/automations-sdk';
import * as z from 'zod';

/**
 * AI-tool automation example. The `aiTool` trigger exposes this automation as a
 * tool to Scout, which can call it when the name and description seem useful to the agent.
 *
 * The tool trigger will return all logs and the outcome (success, failure, or rejection) as the tool result to the Scout context.
 * Unlike other triggers, the tool trigger receives credentials for the identity invoking Scout; you cannot define a role.
 *
 * The deployed `publicId` is the filename without extension: `ai-tool`.
 */
export default defineAutomation({
  metadata: {
    name: 'Creature info',
    // The description is load-bearing: the LLM uses it to decide when to call this tool.
    description: 'Gets you information about a creature in D&D',
    triggers: [{ type: 'aiTool' }],
    inputSchema: z.object({
      name: z
        .string()
        .describe('The name of the creature to get information about, lowercase (e.g. "owlbear").'),
    }),
  },
  handler: async ({ input, log }) => {
    const res = await fetch(`https://www.dnd5eapi.co/api/2014/monsters/${input.name}`);
    const data = await res.json();

    if (!res.ok) {
      log.error(`Failed to fetch creature information: ${res.statusText}`);
      return { outcome: 'failure' };
    }

    // return the creature's json data as the tool result
    log.info(JSON.stringify(data, null, 2));
  },
});
