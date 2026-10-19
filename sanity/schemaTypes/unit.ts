import {defineField, defineType} from 'sanity'

export const unit = defineType({
  name: 'unit',
  title: 'Unit',
  type: 'document',
  fields: [
    defineField({name: 'label', title: 'Unit label', type: 'string', validation: (r) => r.required(), description: 'e.g. Vinohrady 3+kk'}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'label'},
    }),
    defineField({
      name: 'kind',
      title: 'Typ',
      type: 'string',
      options: {
        list: [
          {title: 'Byt', value: 'apartment'},
          {title: 'Dům', value: 'house'},
          {title: 'Pozemek', value: 'land'},
        ],
        layout: 'radio',
      },
      initialValue: 'apartment',
      validation: (r) => r.required(),
    }),
    defineField({name: 'location', title: 'Location', type: 'string'}),
    defineField({name: 'layout', title: 'Dispozice', type: 'string', description: 'např. 3+kk'}),
    defineField({
      name: 'listOnSale',
      title: 'Zobrazit v Prodeji',
      type: 'boolean',
      description: 'Samostatný byt na stránce Prodej, i bez rezidenčního projektu',
      initialValue: true,
    }),
    defineField({
      name: 'listOnRent',
      title: 'Zobrazit v Pronájmu',
      type: 'boolean',
      description: 'Samostatný byt na stránce Pronájem, i bez rezidenčního projektu',
      initialValue: false,
    }),
    defineField({
      name: 'project',
      title: 'Project',
      type: 'reference',
      to: [{type: 'project'}],
      description: 'Volitelné. Nechte prázdné pro byt jen v Prodeji.',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Volné', value: 'available'},
          {title: 'Rezervováno', value: 'reserved'},
          {title: 'Prodáno', value: 'sold'},
          {title: 'Pronajato', value: 'rented'},
        ],
      },
      initialValue: 'available',
    }),
    defineField({name: 'floor', title: 'Floor', type: 'number'}),
    defineField({name: 'rooms', title: 'Rooms', type: 'number'}),
    defineField({
      name: 'areaSqm',
      title: 'Výměra (m²)',
      type: 'number',
      description: 'U domu výměra stavby / užitná plocha',
    }),
    defineField({
      name: 'landAreaSqm',
      title: 'Pozemek (m²)',
      type: 'number',
      description: 'Výměra pozemku — hlavně u domů, odděleně od výměry stavby',
    }),
    defineField({name: 'priceCzk', title: 'Price (CZK)', type: 'number'}),
    defineField({name: 'image', title: 'Photo', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
    }),
    defineField({name: 'descriptionCs', title: 'Description (CS)', type: 'text', rows: 4}),
    defineField({name: 'descriptionEn', title: 'Description (EN)', type: 'text', rows: 4}),
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
