import * as fs from "fs";

import { CanvasDefinitions } from "@uniformdev/canvas";

const PACKAGE_PATH = './mesh-content.json';

console.log(`Cleanup ${PACKAGE_PATH} - start`)

const { categories, components, compositions } = JSON.parse(
  fs.readFileSync(PACKAGE_PATH, "utf-8")
) as CanvasDefinitions;


const content : CanvasDefinitions = {
    categories: categories?.filter((x) => x.name === "Klevu"),
    components: components?.filter((x) => x.id && x.id.startsWith('klevu-')),
    compositions: compositions?.filter((x) => x.composition?._slug?.startsWith('klevu-example'))
}

fs.writeFileSync(PACKAGE_PATH, JSON.stringify(content, null, 2), "utf-8");

console.log(`Cleanup ${PACKAGE_PATH} - done`)


