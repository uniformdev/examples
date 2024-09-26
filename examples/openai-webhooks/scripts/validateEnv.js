const fs = require('fs');
require('dotenv').config();

function isDefined(val) {
  if (!process.env[val]) {
    // eslint-disable-next-line no-console
    console.log('env is not configured: ' + val);
    return process.exit(1);
  }
}

if (!fs.existsSync('./.env')) {
  // eslint-disable-next-line no-console
  console.log('Create .env from .env.example.');
  return process.exit(1);
}

isDefined('UNIFORM_API_KEY');
