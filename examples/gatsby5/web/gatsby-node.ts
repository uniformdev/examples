import path from "path";
import { enhanceComposition } from "./src/lib/canvas";
import { RootComponentInstance } from "@uniformdev/canvas/.";

exports.createPages = async function ({ actions, graphql }) {
  const { data } = await graphql(`
    query {
      allCompositions {
        compositions: edges {
          node {
            name
            slug
            state
            slots
            componentType
            parameters
            composition {
              _id
              _name
              _slug
              type
            }
          }
        }
      }
    }
  `);

  const compositions = data.allCompositions.compositions.map((c: any) =>
    parseComposition(c.node)
  );

  const enhancedCompositions = await Promise.all(
    compositions.map(async (composition: RootComponentInstance) => {
      return await enhanceComposition(composition);
    })
  );

  data.allCompositions.compositions.forEach((c: any, index: number) => {
    actions.createPage({
      path: c.node.slug,
      component: path.resolve(`./src/compositions/page.tsx`),
      context: { composition: enhancedCompositions[index] },
    });
  });
};

function parseComposition(node: any): RootComponentInstance {
  const { composition } = node || {};
  composition.slots = node?.slots ? JSON.parse(node?.slots) : {};
  composition.parameters = node?.parameters ? JSON.parse(node?.parameters) : {};
  return composition;
}
