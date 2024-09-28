const fs = require('fs');
require('dotenv').config();

function isDefined(val) {
  if (!process.env[val]) {
    // eslint-disable-next-line no-console
    console.log('Environment variable is not configured: ' + val);
    return process.exit(1);
  }
}

if (!fs.existsSync('./.env')) {
  // eslint-disable-next-line no-console
  console.log('Create .env file from .env.example');
  return process.exit(1);
}

isDefined('SMARTLING_ACCOUNT_ID');
isDefined('SMARTLING_PROJECT_ID');
isDefined('SMARTLING_USER_ID');
isDefined('SMARTLING_USER_SECRET');
isDefined('UNIFORM_API_KEY');
