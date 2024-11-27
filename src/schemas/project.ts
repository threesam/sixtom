import { seo } from './_partials'
import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'project',
	title: 'Project',
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
		seo
	]
})
