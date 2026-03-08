<script>
	import ServiceBlock from './ServiceBlock.svelte'

	const services = [
		{
			index: '01',
			question: 'What if your website actually brought in customers?',
			answer:
				'Most sites look professional and do nothing. Yours won\'t. Every page, every headline, every call-to-action is built around one thing: turning a visitor into a lead. Live and generating business in under a week.',
			bullets: [
				'First visitors see a reason to stay, not a reason to leave',
				'Loads in under 2 seconds — most visitors leave after 3',
				'Ranks on Google from day one, no SEO agency needed',
				'Generating leads by next Friday'
			],
			dark: true
		},
		{
			index: '02',
			question: 'Ready to turn your store into a sales machine?',
			answer:
				'The difference between a store that converts and one that doesn\'t is friction. Every extra click, every confusing step, every slow page is a sale walking out the door. I remove every barrier between your customer and the checkout.',
			bullets: [
				'Checkout flows people actually complete',
				'Payment and shipping that works the first time, every time',
				'Product pages that answer every objection before it\'s asked',
				'Open for business in days, not quarters'
			],
			dark: false
		},
		{
			index: '03',
			question: 'What would your team do with 10 extra hours a week?',
			answer:
				'The tasks eating your team\'s time — the copy-paste, the manual follow-ups, the repetitive approvals — can run themselves. I wire up the automations so your people can focus on the work that actually moves revenue.',
			bullets: [
				'10+ hours saved per week, starting week one',
				'Customer follow-ups that happen without anyone lifting a finger',
				'Data flows between your tools automatically',
				'You own it outright — no monthly platform fees'
			],
			dark: true
		},
		{
			index: '04',
			question: 'Is broken infrastructure quietly costing you growth?',
			answer:
				'Slow dashboards. Broken integrations. Data scattered across five different tools. Technical debt compounds until it\'s the reason you can\'t scale. I build the foundation that makes everything else work — and keeps working.',
			bullets: [
				'All your data in one place, always accurate',
				'Business dashboards that show what actually matters',
				'Built to handle 10x your current volume without breaking',
				'You stay in control — no vendor dependency'
			],
			dark: false
		}
	]
</script>

{#each services as service}
	<ServiceBlock {...service} />
{/each}
