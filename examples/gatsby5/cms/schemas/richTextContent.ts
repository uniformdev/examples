export default {
  name: 'richTextContent',
  type: 'document',
  title: 'Rich Text Content',
  fields: [
    {
      title: 'Body',
      name: 'Body',
      type: 'array',
      of: [{type: 'block'}, {type: 'image'}],
    },
  ],
}
