import { RouteClient } from "@uniformdev/canvas";

export async function getComposition(path) {
  const client = new RouteClient({
    projectId: "1d90b3f7-0fe8-4157-88dd-6d9cbe737c46",
    apiKey:
      "uf1tdutuuytt5cfln3uhgglguq5zj43ha95wa4fu58a8scd65pp2v544u7gxecrmlmru5ezta5x9mfplnl8hqfvc5rd04mcc0",
  });

  const response = await client.getRoute({
    path: path,
  });

  if (response.type === "composition") {
    console.log({
      text: JSON.stringify(
        response.compositionApiResponse.composition.slots.content[0].parameters.text.value
      ),
    });
    return response.compositionApiResponse.composition;
  }

  return null;
}
