import {defineField, defineType} from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'name'}, validation: (r) => r.required()}),
    defineField({name: 'location', title: 'Location', type: 'string'}),
    defineField({
      name: 'channels',
      title: 'Zobrazení na webu',
      type: 'array',
      description: 'Můžete vybrat více stránek najednou (např. Prodej + Pronájem)',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Rezidenční projekty', value: 'residential'},
          {title: 'Prodej', value: 'sale'},
          {title: 'Pronájem', value: 'rent'},
        ],
      },
      initialValue: ['residential'],
      validation: (r) => r.min(1).required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Apartment / Flat', value: 'apartment'},
          {title: 'House', value: 'house'},
          {title: 'Commercial', value: 'commercial'},
        ],
      },
    }),
    defineField({
      name: 'layout',
      title: 'Dispozice',
      type: 'string',
      description: 'např. 2+kk — hlavně pro Prodej / Pronájem',
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
          {title: 'In progress', value: 'inProgress'},
        ],
      },
      initialValue: 'available',
    }),
    defineField({name: 'price', title: 'Price label', type: 'string', description: 'e.g. 5 420 000 or From €310,000'}),
    defineField({name: 'units', title: 'Units', type: 'number'}),
    defineField({
      name: 'areaSqm',
      title: 'Výměra (m²)',
      type: 'number',
      description: 'Celková / typická výměra projektu v m²',
    }),
    defineField({name: 'year', title: 'Year', type: 'number'}),
    defineField({name: 'featured', title: 'Featured on homepage', type: 'boolean', initialValue: false}),
    defineField({name: 'websiteUrl', title: 'Project website', type: 'url'}),
    defineField({
      name: 'descriptionCs',
      title: 'Description (CS)',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'descriptionEn',
      title: 'Description (EN)',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'image',
      title: 'Hero image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
    }),
    defineField({
      name: 'description',
      title: 'Description (rich text)',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'location', media: 'image'},
  },
})
