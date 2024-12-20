import { defineType, defineArrayMember } from 'sanity'
import { BsCollectionFill } from 'react-icons/bs'

export default defineType({
	name: 'section',
	type: 'document',
	icon: BsCollectionFill,
	fields: [
		{
			name: 'title',
			type: 'string',
			validation: (Rule) => Rule.required()
		},
		{
			name: 'handle',
			type: 'slug',
			options: {
				source: 'title',
				maxLength: 96
			},
			validation: (Rule) => Rule.required()
		},
		{
			name: 'subtitle',
			type: 'string'
		},
		{
			name: 'description',
			type: 'text',
			rows: 3
		},
		{
			name: 'type',
			type: 'string',
			options: {
				list: [
					{ title: 'Grid', value: 'grid' },
					{ title: 'Slider', value: 'slider' },
					{ title: 'Carousel', value: 'carousel' }
				],
				layout: 'radio'
			},
			validation: (Rule) => Rule.required().error('Type is required')
		},
		{
			name: 'items',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'reference',
					name: 'project',
					title: 'Project',
					to: [{ type: 'project' }]
				}),
				defineArrayMember({
					type: 'reference',
					name: 'post',
					title: 'Post',
					to: [{ type: 'post' }]
				}),
				defineArrayMember({
					type: 'reference',
					name: 'quote',
					title: 'Quote',
					to: [{ type: 'quote' }]
				})
			]
		},
		{
			name: 'tags',
			type: 'array',
			of: [{ type: 'string' }]
		}
	]
})
