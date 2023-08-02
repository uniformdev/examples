import {
  enhance,
  EnhancerBuilder,
  RootComponentInstance,
} from "@uniformdev/canvas";
import {
  createKontentEnhancer,
  KontentClientList,
  CANVAS_KONTENT_PARAMETER_TYPES,
} from "@uniformdev/canvas-kontent";
import { DeliveryClient } from "@kentico/kontent-delivery";

export async function enhanceComposition(composition: RootComponentInstance) {
  const client = new DeliveryClient({
    projectId: process.env.KONTENT_PROJECT_ID!,
    secureApiKey: process.env.KONTENT_DELIVERY_API_KEY!,
    defaultQueryConfig: {
      useSecuredMode: true, // Queries the Delivery API using secure access.
    },
  });

  const clientList = new KontentClientList({ client });
  const kontentEnhancer = createKontentEnhancer({ clients: clientList });

  const enhancers = new EnhancerBuilder().parameterType(
    CANVAS_KONTENT_PARAMETER_TYPES,
    kontentEnhancer
  );

  await enhance({
    composition,
    enhancers,
    context: {},
  });
  return composition;
}
