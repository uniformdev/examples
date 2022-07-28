/* eslint-disable no-console */
const fs = require('fs');
const { inc, valid, coerce } = require('semver');

require('dotenv').config();

const FALLBACK_VERSION = '0.1.0';

const VERSION_INCREMENT = process.env.AKAMAI_WORKER_VERSION_INCREMENT || 'patch';

const data = fs.readFileSync('src/bundle.json', { encoding: 'utf-8' });
const json = JSON.parse(data);

const oldVersion = coerce(json['edgeworker-version']);
console.log('Found old version:', oldVersion.version);

let newVersion = '';

if (valid(oldVersion)) {
  newVersion = inc(oldVersion, VERSION_INCREMENT);

  console.log('Updating version to:', newVersion);
} else {
  newVersion = FALLBACK_VERSION;

  console.log('Old version is not valid:', oldVersion);
  console.log('Use fallback version:', FALLBACK_VERSION);
}

json['edgeworker-version'] = newVersion;

fs.writeFileSync('src/bundle.json', JSON.stringify(json, null, 2));
