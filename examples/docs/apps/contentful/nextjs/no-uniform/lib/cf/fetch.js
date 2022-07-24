const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN
const client = require('contentful').createClient({
  space,
  accessToken,
})

function getFields(entry) {
  const { fields } = entry;
  if (fields?.image) {
    fields.image = fields.image.fields.file.url;
  }
  if (!fields.id && entry.sys?.id) {
    fields.id = entry.sys?.id;
  }
  return fields;
}

export async function fetch(id) {
  const entry = await client.getEntry(id);
  const fields = getFields(entry);
  return fields;
}
