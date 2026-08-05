import {defineField, defineType} from 'sanity'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog post',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title'}, validation: (r) => r.required()}),
    defineField({name: 'excerpt', title: 'Excerpt', type: 'text'}),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Market', value: 'market'},
          {title: 'Design', value: 'design'},
          {title: 'Investment', value: 'investment'},
          {title: 'Lifestyle', value: 'lifestyle'},
        ],
      },
    }),
    defineField({name: 'author', title: 'Author', type: 'string'}),
    defineField({name: 'publishedAt', title: 'Published at', type: 'datetime'}),
    defineField({name: 'readTime', title: 'Read time (min)', type: 'number'}),
    defineField({name: 'image', title: 'Cover image', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
})
