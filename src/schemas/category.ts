import { defineField, defineType } from 'sanity'
import { TbCategoryFilled } from 'react-icons/tb'

export default defineType({
	name: 'category',
	title: 'Category',
	type: 'document',
	icon: TbCategoryFilled,
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string'
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'text'
		})
	]
})
