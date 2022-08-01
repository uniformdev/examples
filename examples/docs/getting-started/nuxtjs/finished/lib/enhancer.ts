import {
  enhance,
  EnhancerBuilder,
  type ComponentInstance,
  type ComponentEnhancerFunction,
} from "@uniformdev/canvas";
import content from "../lib/content.json";

// Uses the parameter value from the composition
// to look up the topic from the data file. If
// the topic is found, the fields are returned.
const dataEnhancer: ComponentEnhancerFunction = async ({ component }) => {
  const contentId = component?.parameters?.contentId?.value;
  if (contentId) {
    const topic = content.find((e) => e.id == contentId);
    if (topic) {
      return { ...topic.fields };
    }
  }
};

export default async function doEnhance(composition: ComponentInstance) {
  const enhancedComposition = { ...composition };
  const enhancers = new EnhancerBuilder().data("fields", dataEnhancer);
  await enhance({
    composition: enhancedComposition,
    enhancers,
    context: {},
  });

  return enhancedComposition;
}
