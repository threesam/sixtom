import { defineField, defineType } from 'sanity'
import { BsFillSignpostFill } from 'react-icons/bs'
import { seo } from './_partials'

export default defineType({
	name: 'post',
	title: 'Post',
	type: 'document',
	icon: BsFillSignpostFill,
	fields: [
		defineField({
			name: 'title',
			type: 'string'
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: {
				source: 'title',
				maxLength: 96
			}
		}),
		defineField({
			name: 'description',
			type: 'text'
		}),
		defineField({ name: 'excerpt', type: 'text' }),
		defineField({ name: 'featuredImage', type: 'image', options: { hotspot: true } }),
		defineField({ name: 'tags', type: 'array', of: [{ type: 'string' }] }),
		defineField({
			name: 'person',
			type: 'reference',
			to: { type: 'person' }
		}),
		defineField({
			name: 'image',
			type: 'image',
			options: {
				hotspot: true
			}
		}),
		defineField({
			name: 'categories',
			type: 'array',
			of: [{ type: 'reference', to: { type: 'category' } }]
		}),
		defineField({
			name: 'publishedAt',
			title: 'Published at',
			type: 'datetime'
		}),
		defineField({
			name: 'body',
			type: 'blockContent'
		}),
		seo
	],

	preview: {
		select: {
			title: 'title',
			person: 'person.name',
			media: 'mainImage'
		},
		prepare(selection) {
			const { person } = selection
			return { ...selection, subtitle: person && `by ${person}` }
		}
	}
})
