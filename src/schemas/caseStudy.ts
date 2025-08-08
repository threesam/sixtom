import { defineField, defineType } from 'sanity'
import { MdCases } from 'react-icons/md'
import { seo } from './_partials'

export default defineType({
	name: 'caseStudy',
	title: 'Case Study',
	type: 'document',
	icon: MdCases,
	fields: [
		defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: { source: 'title', maxLength: 96 },
			validation: (Rule) => Rule.required()
		}),
		defineField({ name: 'summary', type: 'text', rows: 3 }),
		defineField({ name: 'heroImage', type: 'image', options: { hotspot: true } }),
		defineField({ name: 'company', type: 'string' }),
		defineField({ name: 'industry', type: 'string' }),
		defineField({ name: 'services', type: 'array', of: [{ type: 'string' }] }),
		defineField({
			name: 'metrics',
			title: 'Key metrics',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{ name: 'label', type: 'string' },
						{ name: 'value', type: 'string' }
					]
				}
			]
		}),
		defineField({ name: 'publishedAt', title: 'Published at', type: 'datetime' }),
		defineField({ name: 'problem', type: 'blockContent', title: 'Problem' }),
		defineField({ name: 'solution', type: 'blockContent', title: 'Solution' }),
		defineField({ name: 'results', type: 'blockContent', title: 'Results' }),
		defineField({ name: 'ctaLabel', type: 'string', title: 'CTA Label' }),
		defineField({ name: 'ctaUrl', type: 'url', title: 'CTA URL' }),
		seo
	]
})