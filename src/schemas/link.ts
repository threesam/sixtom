import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'link',
	title: 'Link',
	type: 'object',
	fields: [
		defineField({
			name: 'title',
			type: 'string'
		}),
		defineField({
			name: 'url',
			type: 'url'
		})
	]
})
