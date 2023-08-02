// import path from "path";
// import fs from 'fs';
// import { enhanceComposition } from "./src/lib/canvas";
// import { RootComponentInstance } from "@uniformdev/canvas/.";
// import { execSync } from "child_process";

// const pluginDirectory = path.resolve(__dirname, '../uniform-source-plugin');

// // Install plugin dependencies
// console.log('Installing uniform-source-plugin dependencies');
// execSync('npm install', { cwd: pluginDirectory });

// // Run uniform:download-manifest script
// console.log('Downloading Uniform manifest');
// execSync('npm run uniform:download-manifest');

// exports.createPages = async function ({ actions, graphql }: any) {
//   const { data } = await graphql(`
//     query {
//       allCompositions {
//         compositions: edges {
//           node {
//             name
//             slug
//             state
//             slots
//             componentType
//             parameters
//             composition {
//               _id
//               _name
//               _slug
//               type
//             }
//           }
//         }
//       }
//     }
//   `);

//   const compositions = data.allCompositions.compositions.map((c: any) =>
//     parseComposition(c.node)
//   );

//   const enhancedCompositions = await Promise.all(
//     compositions.map(async (composition: RootComponentInstance) => {
//       return await enhanceComposition(composition);
//     })
//   );

//   data.allCompositions.compositions.forEach((c: any, index: number) => {
//     const slug: string = c.node.slug;
//     const overridePath = path.resolve(`./src/pages${slug}.tsx`);
//     const doesExist = fs.existsSync(overridePath);

//     if (!doesExist) {
//       actions.createPage({
//         path: c.node.slug,
//         component: path.resolve(`./src/compositions/page.tsx`),
//         context: { composition: enhancedCompositions[index] },
//       });
//     }
//   });
// };

// function parseComposition(node: any): RootComponentInstance {
//   const { composition } = node || {};
//   composition.slots = node?.slots ? JSON.parse(node?.slots) : {};
//   composition.parameters = node?.parameters ? JSON.parse(node?.parameters) : {};
//   return composition;
// }
