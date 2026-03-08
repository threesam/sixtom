<script>
	import ServiceBlock from './ServiceBlock.svelte'

	const services = [
		{
			index: '01',
			question: 'What if your website actually brought in customers?',
			answer: 'Built to turn visitors into leads. Live in under a week.',
			bullets: [
				'Loads in under 2 seconds — most visitors leave after 3',
				'Ranks on Google from day one',
				'Generating leads by next Friday'
			],
			dark: true
		},
		{
			index: '02',
			question: 'Ready to turn your store into a sales machine?',
			answer: 'Every barrier between your customer and checkout — removed.',
			bullets: [
				'Checkout flows people actually complete',
				'Product pages that answer objections before they\'re asked',
				'Open for business in days, not quarters'
			],
			dark: false
		},
		{
			index: '03',
			question: 'What would your team do with 10 extra hours a week?',
			answer: 'Automate the repetitive work so your people focus on what moves revenue.',
			bullets: [
				'10+ hours saved per week from day one',
				'Follow-ups and data flows run themselves',
				'You own it outright — no monthly platform fees'
			],
			dark: true
		},
		{
			index: '04',
			question: 'Is broken infrastructure quietly costing you growth?',
			answer: 'The foundation that makes everything else work — and keeps working.',
			bullets: [
				'All your data in one place, always accurate',
				'Dashboards that show what actually matters',
				'Built to scale without breaking'
			],
			dark: false
		}
	]
</script>

{#each services as service}
	<ServiceBlock {...service} />
{/each}
