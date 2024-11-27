import { seo } from './_partials'
import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'catalog',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			type: 'string'
		}),
		defineField({
			name: 'handle',
			type: 'slug',
			options: {
				source: 'title',
				maxLength: 96
			}
		}),
		defineField({
			name: 'subtitle',
			type: 'string'
		}),
		defineField({
			name: 'description',
			type: 'text'
		}),

		defineField({
			type: 'array',
			name: 'images',
			of: [{ type: 'image' }]
		}),
		defineField({
			name: 'links',
			type: 'array',
			of: [{ type: 'link' }]
		}),
		defineField({
			name: 'tags',
			title: 'Tags',
			type: 'array',
			of: [{ type: 'string' }]
		}),
		seo
	]
})
