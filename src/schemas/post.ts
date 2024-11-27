import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'post',
	title: 'Post',
	type: 'document',
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
		defineField({
			name: 'author',
			type: 'reference',
			to: { type: 'author' }
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
		})
	],

	preview: {
		select: {
			title: 'title',
			author: 'author.name',
			media: 'mainImage'
		},
		prepare(selection) {
			const { author } = selection
			return { ...selection, subtitle: author && `by ${author}` }
		}
	}
})
