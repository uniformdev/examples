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
  if (fields.unfrmOptEnrichmentTag) {
    fields.enrichments = fields.unfrmOptEnrichmentTag;
    delete fields.unfrmOptEnrichmentTag;
  }
  if (fields.unfrmOptPersonalizationCriteria) {
    fields.pz = fields.unfrmOptPersonalizationCriteria;
    delete fields.unfrmOptPersonalizationCriteria;
  }
  return fields;
}

export async function fetch(id) {
  const entry = await client.getEntry(id);
  const fields = getFields(entry);
  return fields;
}

export async function fetchVariations(id) {
  const entry = await fetch(id);
  const { unfrmOptP13nList } = entry;
  return unfrmOptP13nList.map(getFields);
}
