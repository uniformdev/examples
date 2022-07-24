#!/usr/bin/env node

//
//The demo web app requires certain environment variables be set in
//order for the app to interact with Canvas. This script ensures 
//those variables are set.

require("dotenv").config();
const missing = [];
if (process.env.UNIFORM_API_KEY == "[!!! YOUR API KEY !!!]") {
  missing.push("UNIFORM_API_KEY");
}
if (process.env.UNIFORM_PROJECT_ID == "[!!! YOUR PROJECT ID !!!]") {
  missing.push("UNIFORM_PROJECT_ID");
}
if (process.env.NEXT_PUBLIC_UNIFORM_PROJECT_ID == "[!!! YOUR PROJECT ID !!!]") {
  missing.push("NEXT_PUBLIC_UNIFORM_PROJECT_ID");
}
if (missing.length > 0) {
  console.error("The following env vars must be set: ");
  missing.forEach((name) => {
    console.error(` * ${name}`);
  });
  process.exit(1);
}
