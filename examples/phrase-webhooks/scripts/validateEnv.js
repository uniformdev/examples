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

isDefined('PHRASE_API_HOST');
isDefined('PHRASE_USER_NAME');
isDefined('PHRASE_USER_PASSWORD');
isDefined('PHRASE_WEBHOOK_SECRET_TOKEN');
isDefined('PHRASE_PROJECT_UID');
isDefined('UNIFORM_API_KEY');

if (process.env.WORKFLOW_LOCKED_FOR_TRANSLATION_STAGE_ID) {
  isDefined('UNIFORM_SOURCE_LANGUAGE');
  isDefined('UNIFORM_TARGET_LANGUAGE');
  isDefined('PHRASE_TARGET_LANGUAGE');
}
