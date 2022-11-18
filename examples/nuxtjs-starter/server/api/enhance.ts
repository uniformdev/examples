import { H3Event } from "h3";
import runEnhancers from "~~/lib/uniform/enhancers/index";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const composition = body.composition;
  await runEnhancers(composition, false);
  return { composition };
});
