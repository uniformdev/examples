/* eslint-disable no-console */
const fs = require('fs');
const { coerce } = require('semver');
const { exec } = require("child_process");

require("dotenv").config();

const data = fs.readFileSync('src/bundle.json', { encoding: 'utf-8' });
const json = JSON.parse(data);

const currentVersion = coerce(json['edgeworker-version']);

const WORKER_ID = process.env.AKAMAI_WORKER_ID;
if (!WORKER_ID) {
  throw new Error("AKAMAI_WORKER_ID env missing");
}

exec(
  `akamai edgeworkers status ${WORKER_ID}`,
  (error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error.message}`);
      return;
    }
    console.log(stdout);
    console.log('Your current version:', currentVersion.version);
  }
);
