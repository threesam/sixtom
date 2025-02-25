import { defineField, defineType } from 'sanity'
// import { LuPaintbrush2 } from 'react-icons/lu'
import { seo } from './_partials'

export default defineType({
	name: 'project',
	title: 'Project',
	type: 'document',
	// icon: LuPaintbrush2,
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
		{
			name: 'person',
			type: 'reference',
			to: [{ type: 'person' }]
		},
		defineField({
			name: 'image',
			type: 'image'
		}),
		defineField({
			name: 'links',
			type: 'array',
			of: [{ type: 'link' }]
		}),
		defineField({
			name: 'order',
			type: 'number',
			hidden: true
		}),
		defineField({
			name: 'caseStudy',
			title: 'Case Study',
			type: 'blockContent'
		}),
		defineField({
			name: 'tags',
			title: 'Tags',
			type: 'array',
			of: [{ type: 'string' }]
		}),
		defineField({
			type: 'object',
			name: 'config',
			fields: [
				{
					type: 'boolean',
					name: 'isActive'
				},
				{
					type: 'boolean',
					name: 'isFeatured'
				}
			]
		}),
		seo
	]
})
