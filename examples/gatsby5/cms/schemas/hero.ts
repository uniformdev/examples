export default {
  name: 'hero',
  type: 'document',
  title: 'Hero',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
    },
    {
      name: 'description',
      type: 'text',
      title: 'Description',
    },
    {
      name: 'image',
      type: 'image',
      title: 'Image',
    },
    {
      name: 'ctaLink',
      title: 'CTA Link',
      type: 'url',
    },
    {
      name: 'ctaTitle',
      title: 'CTA Title',
      type: 'string',
    },
  ],
}
