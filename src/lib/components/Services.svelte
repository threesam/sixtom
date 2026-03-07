<script>
	import ServiceBlock from './ServiceBlock.svelte'

	const services = [
		{
			index: '01',
			question: 'Need a website that actually converts?',
			answer:
				'High-performance landing pages and marketing sites, built on modern frameworks and deployed in days. Designed to load fast, rank well, and turn visitors into customers.',
			bullets: [
				'SvelteKit, Next.js, or static — whatever fits',
				'Mobile-first, performance-obsessed',
				'SEO baked in from day one',
				'Live in under a week'
			],
			dark: true
		},
		{
			index: '02',
			question: 'Ready to sell online?',
			answer:
				'Your store, launched. From product catalog to checkout flow, optimized for the sale — not for dragging out a project timeline.',
			bullets: [
				'Shopify or custom storefront',
				'Checkout flow optimization',
				'Payment & shipping integrations',
				'Product launch in days, not quarters'
			],
			dark: false
		},
		{
			index: '03',
			question: 'What if AI handled the boring stuff?',
			answer:
				'One engineer with the right AI stack replaces a 10-person department. We wire up automations that let your team focus on the work that actually matters.',
			bullets: [
				'Workflow automation',
				'AI integrations — chat, summarization, triage',
				'Internal tools that save hours per week',
				'No vendor lock-in, ever'
			],
			dark: true
		},
		{
			index: '04',
			question: 'Want your digital systems just... working?',
			answer:
				'APIs, dashboards, CMS, hosting — the scaffolding that makes everything else possible. We get it stood up fast so you can focus on growing.',
			bullets: [
				'CMS setup (Sanity)',
				'API design & integration',
				'Admin dashboards & internal tools',
				'Infrastructure that scales with you'
			],
			dark: false
		}
	]
</script>

{#each services as service}
	<ServiceBlock {...service} />
{/each}
