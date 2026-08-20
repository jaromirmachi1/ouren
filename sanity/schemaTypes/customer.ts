import {defineField, defineType} from 'sanity'

export const customer = defineType({
  name: 'customer',
  title: 'Customer',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Full name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'email', title: 'Email', type: 'string', validation: (r) => r.email()}),
    defineField({name: 'phone', title: 'Phone', type: 'string'}),
    defineField({
      name: 'status',
      title: 'Pipeline status',
      type: 'string',
      options: {
        list: [
          {title: 'Lead', value: 'lead'},
          {title: 'Qualified', value: 'qualified'},
          {title: 'Reservation', value: 'reservation'},
          {title: 'Contract', value: 'contract'},
          {title: 'Closed', value: 'closed'},
          {title: 'Lost', value: 'lost'},
        ],
      },
      initialValue: 'lead',
    }),
    defineField({
      name: 'interestedProjects',
      title: 'Interested projects',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'project'}]}],
    }),
    defineField({
      name: 'assignedUnits',
      title: 'Assigned units',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'unit'}]}],
    }),
    defineField({
      name: 'lookingForLayouts',
      title: 'Looking for layouts',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'S', value: 'S'},
          {title: '1kk', value: '1kk'},
          {title: '2kk', value: '2kk'},
          {title: '3kk', value: '3kk'},
          {title: '4kk', value: '4kk'},
          {title: 'Multiple', value: 'Multiple'},
        ],
        layout: 'grid',
      },
    }),
    defineField({name: 'preferredLanguage', title: 'Preferred language', type: 'string', options: {list: ['cs', 'en']}, initialValue: 'cs'}),
    defineField({name: 'source', title: 'Lead source', type: 'string'}),
    defineField({name: 'notes', title: 'Notes', type: 'text'}),
    defineField({
      name: 'portalAccess',
      title: 'Customer portal access',
      type: 'boolean',
      initialValue: false,
      description: 'Allow this customer to log into the internal portal',
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'email', status: 'status'},
    prepare({title, subtitle, status}) {
      return {title, subtitle: `${subtitle} · ${status}`}
    },
  },
})
