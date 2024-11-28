import { defineType, defineArrayMember } from 'sanity'
import { MdRequestPage } from 'react-icons/md'

export default defineType({
	name: 'page',
	type: 'document',
	title: 'Page',
	icon: MdRequestPage,
	fields: [
		{
			name: 'title',
			type: 'string',
			title: 'Title',
			validation: (Rule) => Rule.required()
		},
		{
			name: 'handle',
			type: 'slug',
			title: 'Handle',
			options: {
				source: 'title',
				maxLength: 96
			},
			validation: (Rule) => Rule.required()
		},
		{
			name: 'sections',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'hero',
					title: 'Hero Section',
					fields: [
						{
							name: 'heading',
							type: 'string',
							title: 'Heading',
							validation: (Rule) => Rule.required()
						},
						{
							name: 'subtitle',
							type: 'string'
						},
						{
							name: 'image',
							type: 'image',
							options: {
								hotspot: true
							}
						}
					]
				}),
				defineArrayMember({
					type: 'reference',
					name: 'section',
					to: [{ type: 'section' }] // Referencing the "project" document type
				})
			]
		}
	]
})
