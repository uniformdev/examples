#!/usr/bin/env node
const contentfulExport = require('contentful-export')
const dotenv = require('dotenv')
dotenv.config()

const options = {
  contentFile: './data.json',
  downloadAssets: true,
  exportDir: './content/cf',
  managementToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
  skipEditorInterfaces: true,
  skipRoles: true,
  skipWebhooks: true,
  spaceId: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
}

contentfulExport(options)
  .then(() => {
    console.log('Data exported successfully')
  })
  .catch((err) => {
    console.log('Oh no! Some errors occurred!', err)
  })