import { defineField, defineType } from 'sanity'
import { FaQuoteLeft } from 'react-icons/fa'
import type { Rule } from 'sanity'

export default defineType({
	name: 'quote',
	type: 'document',
	title: 'Quote',
	icon: FaQuoteLeft,
	fields: [
		{
			name: 'text',
			type: 'text',
			description: 'The main text of the quote.',
			validation: (Rule: Rule) =>
				Rule.required().min(10).error('The quote must be at least 10 characters long.')
		},
		defineField({
			name: 'person',
			description: 'Who said it?',
			type: 'reference',
			to: [{ type: 'person' }]
		}),
		{
			name: 'subtitle',
			type: 'string'
		},
		{
			name: 'source',
			type: 'url',
			description: 'An optional source or link to where the quote was taken from.'
		},
		{
			name: 'tags',
			type: 'array',
			of: [{ type: 'string' }],
			description: 'Tags to help categorize the quote.'
		}
	]
})
