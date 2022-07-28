/* eslint-disable no-console */
const { exec } = require('child_process');

require('dotenv').config();

const WORKER_ID = process.env.AKAMAI_WORKER_ID;
if (!WORKER_ID) {
  throw new Error('AKAMAI_WORKER_ID env missing');
}

exec(`cd dist && tar -czvf bundle.tgz main.js bundle.json && cd ..`, (error, stdout, stderr) => {
  exec(`akamai edgeworkers upload ${WORKER_ID} --bundle dist/bundle.tgz`, (error, stdout, stderr) => {
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
})
