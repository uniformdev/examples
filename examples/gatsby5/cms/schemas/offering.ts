export default {
  name: 'offering',
  type: 'document',
  title: 'Offering',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
    },
    {
      name: 'offeringName',
      type: 'string',
      title: 'Offering Name',
    },
    {
      name: 'offeringImage',
      type: 'image',
      title: 'Offering image',
    },
    {
      name: 'offeringSummary',
      type: 'string',
      title: 'Offering Summary',
    },
    {
      name: 'offeringIntroduction',
      type: 'text',
      title: 'Offering Introduction',
    },
    {
      name: 'offeringDescription',
      type: 'text',
      title: 'Offering Description',
    },
  ],
}
