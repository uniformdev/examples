/* eslint-disable no-console */
const fs = require('fs');
const { exec } = require('child_process');

require('dotenv').config();

const WORKER_ID = process.env.AKAMAI_WORKER_ID;
const NETWORK = process.env.AKAMAI_WORKER_NETWORK;

if (!WORKER_ID) {
  throw new Error('AKAMAI_WORKER_ID env missing');
}

if (!NETWORK) {
  throw new Error('AKAMAI_WORKER_NETWORK env missing');
}

const data = fs.readFileSync('dist/bundle.json', { encoding: 'utf-8' });
const json = JSON.parse(data);

const version = json['edgeworker-version'];
if (!version) {
  throw new Error('edgeworker-version missing in the bundle.json');
}

exec(`akamai edgeworkers activate ${WORKER_ID} ${NETWORK} ${version}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`error: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }

  console.log(`stdout:\n${stdout}`);
});
