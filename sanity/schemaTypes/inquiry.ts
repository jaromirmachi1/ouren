import {defineField, defineType} from 'sanity'

export const inquiry = defineType({
  name: 'inquiry',
  title: 'Inquiry',
  type: 'document',
  fields: [
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Sell with us', value: 'sell'},
          {title: 'Buy / interest', value: 'buy'},
          {title: 'General contact', value: 'contact'},
        ],
      },
      initialValue: 'contact',
    }),
    defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'email', title: 'Email', type: 'string'}),
    defineField({name: 'phone', title: 'Phone', type: 'string'}),
    defineField({name: 'propertyType', title: 'Property type', type: 'string'}),
    defineField({name: 'estimatedValue', title: 'Estimated value', type: 'string'}),
    defineField({name: 'message', title: 'Message', type: 'text'}),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'New', value: 'new'},
          {title: 'In progress', value: 'inProgress'},
          {title: 'Done', value: 'done'},
          {title: 'Spam', value: 'spam'},
        ],
      },
      initialValue: 'new',
    }),
    defineField({
      name: 'relatedProject',
      title: 'Related project',
      type: 'reference',
      to: [{type: 'project'}],
    }),
    defineField({
      name: 'customer',
      title: 'Linked customer',
      type: 'reference',
      to: [{type: 'customer'}],
    }),
    defineField({name: 'createdAt', title: 'Received at', type: 'datetime', initialValue: () => new Date().toISOString()}),
  ],
  orderings: [
    {title: 'Newest', name: 'createdAtDesc', by: [{field: 'createdAt', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'name', subtitle: 'type', status: 'status'},
    prepare({title, subtitle, status}) {
      return {title, subtitle: `${subtitle} · ${status}`}
    },
  },
})
