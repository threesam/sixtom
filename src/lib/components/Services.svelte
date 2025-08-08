<script>
	const services = [
		{
			name: 'Modular Web Development',
			text: 'Deliver high-performance, responsive websites that grow with your business, focusing on speed and user experience for long-term impact.',
			icon: `<svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="35" height="35"><path d="M0 13.5h15M1.5 2.5v8a1 1 0 001 1h10a1 1 0 001-1v-8a1 1 0 00-1-1h-10a1 1 0 00-1 1z" stroke="currentColor"></path></svg>` // Laptop Icon
		},
		{
			name: 'E-Commerce Optimized for Sales',
			text: 'Build intuitive online stores that turn visitors into loyal customers by providing seamless shopping experiences and optimized checkout flows.',
			icon: `<svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="35" height="35"><path d="M.5.5l.6 2m0 0l2.4 8h11v-6a2 2 0 00-2-2H1.1zm11.4 12a1 1 0 110-2 1 1 0 010 2zm-8-1a1 1 0 112 0 1 1 0 01-2 0z" stroke="currentColor"></path></svg>` // Shopping Cart Icon
		},
		{
			name: 'Targeted Digital Marketing',
			text: 'Boost your brand visibility and grow your audience with data-driven marketing strategies designed to maximize reach and engagement.',
			icon: `<svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="35" height="35"><path d="M2.5 1.5a1 1 0 11-2 0 1 1 0 012 0zm0 0h5v12h5m0 0a1 1 0 102 0 1 1 0 00-2 0z" stroke="currentColor"></path></svg>` // Analytics Icon
		},
		{
			name: 'Brand Impact Design',
			text: 'Craft a compelling brand identity that resonates emotionally with your audience and drives long-term customer loyalty.',
			icon: `<svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="35" height="35"><path d="M.5 14l-.481-.136a.5.5 0 00.758.552L.5 14zm.971-3.422l.481.136-.48-.136zm-.46 3.081l-.277-.416.277.416zm2.062-.148l-.215.451.215-.451zM5 6l-.25-.433a.5.5 0 00-.104.787L5 6zm4 4l-.354.354a.5.5 0 00.787-.103L9 10zM14.5.5l.433.25a.5.5 0 00-.684-.683L14.5.5zM.981 14.136l.971-3.422-.962-.273-.971 3.422.962.274zm2.956-4.922H4v-1h-.063v1zm2.063 2v.053h1v-.053H6zm-1.947 2h-.08v1h.08v-1zm-3.32.03l-.51.34.554.832.512-.34-.555-.833zm2.555-.185a2.594 2.594 0 00-2.554.184l.555.832a1.594 1.594 0 011.569-.113l.43-.903zm.685.155c-.237 0-.471-.053-.685-.155l-.43.903c.348.166.73.252 1.115.252v-1zM6 11.267a1.947 1.947 0 01-1.947 1.947v1A2.947 2.947 0 007 11.267H6zM4 9.214a2 2 0 012 2h1a3 3 0 00-3-3v1zm-2.048 1.5a2.063 2.063 0 011.985-1.5v-1c-1.37 0-2.573.91-2.947 2.227l.962.273zm2.694-4.36l4 4 .708-.708-4-4-.708.708zM14.25.067l-9.5 5.5.5.866 9.5-5.5-.5-.866zM9.432 10.251l5.5-9.5-.866-.502-5.5 9.5.866.502zM7.146 4.854l3 3 .708-.708-3-3-.708.708z" fill="currentColor"></path></svg>` // Painting Icon (abstract, representing brush strokes)
		}
	]
</script>

<section id="services" class="bg-gray-100 py-20">
	<div class="container relative mx-auto xl:px-4">
		<h2
			class="mb-4 px-4 text-2xl font-bold text-black max-xl:border-b-2 max-xl:border-brand-yellow xl:mb-12 xl:text-center xl:text-4xl"
		>
			How We Accelerate Growth
		</h2>
		<div class="grid grid-cols-1 gap-16 xl:grid-cols-2 xl:gap-24">
			{#each services as { name, text, icon }}
				<div class="flex max-w-full items-start space-x-4 p-4">
					<div class="flex-shrink-0">
						{@html icon}
					</div>
					<div>
						<h3 class="mb-2 text-lg font-semibold text-black xl:text-xl">{name}</h3>
						<p class="text-gray-600">
							{text}
						</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
