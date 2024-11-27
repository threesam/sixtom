export default {
	name: 'siteSettings',
	type: 'document',
	title: 'Site Settings',
	__experimental_actions: ['update', /*'create', 'delete',*/ 'publish'],
	fields: [
		{
			name: 'title',
			type: 'string',
			title: 'Title'
		},
		{
			name: 'description',
			type: 'text',
			title: 'Description',
			description: 'Describe your blog for search engines and social media.'
		},
		{
			name: 'tagLine',
			type: 'text',
			title: 'Tag Line'
		},
		{
			name: 'image',
			type: 'image'
		},
		{
			name: 'author',
			type: 'reference',
			title: 'Founder',
			to: [{ type: 'author' }]
		},
		{
			name: 'resume',
			type: 'file',
			title: 'Resume'
		}
	]
}
