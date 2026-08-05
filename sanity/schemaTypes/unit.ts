import {defineField, defineType} from 'sanity'

export const unit = defineType({
  name: 'unit',
  title: 'Unit',
  type: 'document',
  fields: [
    defineField({name: 'label', title: 'Unit label', type: 'string', validation: (r) => r.required(), description: 'e.g. A3.2'}),
    defineField({
      name: 'project',
      title: 'Project',
      type: 'reference',
      to: [{type: 'project'}],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Available', value: 'available'},
          {title: 'Reserved', value: 'reserved'},
          {title: 'Sold', value: 'sold'},
        ],
      },
      initialValue: 'available',
    }),
    defineField({name: 'floor', title: 'Floor', type: 'number'}),
    defineField({name: 'rooms', title: 'Rooms', type: 'number'}),
    defineField({name: 'areaSqm', title: 'Area (m²)', type: 'number'}),
    defineField({name: 'priceCzk', title: 'Price (CZK)', type: 'number'}),
    defineField({name: 'layoutImage', title: 'Floor plan', type: 'image'}),
    defineField({
      name: 'customer',
      title: 'Assigned customer',
      type: 'reference',
      to: [{type: 'customer'}],
    }),
    defineField({name: 'notes', title: 'Internal notes', type: 'text'}),
  ],
  preview: {
    select: {title: 'label', subtitle: 'project.name', status: 'status'},
    prepare({title, subtitle, status}) {
      return {title, subtitle: `${subtitle || 'No project'} · ${status || ''}`}
    },
  },
})
