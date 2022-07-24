/**
 * StackBlitz processes are not able to serve static assets,
 * so another approach is neeed to get the badge and logo
 * images to display when running a Mesh integration in
 * StackBlitz.
 * 
 * This script generates base64 strings that can be used 
 * instead of the image url in the Mesh integration 
 * configuration.
 * 
 * Example 1 (single image): 
 *  node base64.js ../public/monster-logo.svg
 * 
 * Example 2 (multiple images):
 *  node base64.js ../public/monster-badge.svg ../public/monster-logo.svg
 * 
 */
const fs = require("fs");
const path = require("path");
const args = process.argv.slice(2);
if (args.length > 0) {
  args.forEach((arg) => {
    const filePath = path.resolve(".", `${arg}`);
    if (fs.existsSync(filePath)) {
      const buffer = fs.readFileSync(filePath);
      const base64 = buffer.toString("base64");
      console.log(`========= START: ${arg} =========`);
      console.log(`data:image/svg+xml;base64,${base64}`);
      console.log(`========= END: ${arg} =========`);
    }
  });
}
