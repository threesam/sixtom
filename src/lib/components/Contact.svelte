<script lang="ts">
	let innerWidth = $state(0)
	let name = $state('')
	let email = $state('')
	let message = $state('')
	let status = $state('')

	// Form validation: Check if all required fields are filled
	let isFormValid = $derived(name.trim() !== '' && email.trim() !== '' && message.trim() !== '')

	async function submitForm(e) {
		e.preventDefault()
		const response = await fetch('/api/send-email', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name, email, message })
		})

		const result = await response.json()
		status = result.status
	}
</script>

<svelte:window bind:innerWidth />

<section class="container w-full py-2 md:py-12" id="contact">
	<div class="mx-auto max-w-lg">
		<h2 class="mb-4 text-center text-3xl font-bold text-white md:mb-8 md:text-5xl">Get In Touch</h2>
		<form class="mx-auto" onsubmit={submitForm}>
			<div class="mb-4">
				<label for="name" class="mb-1 block font-bold text-gray-100">Name</label>
				<input
					bind:value={name}
					type="text"
					id="name"
					name="name"
					class="w-full rounded-md border-2 border-gray-800 bg-transparent px-3 py-1 text-gray-100 placeholder-gray-400 transition-all duration-500 focus:border-yellow-400 focus:outline-none focus:ring-yellow-400"
					placeholder="please tell us your name"
					required
				/>
			</div>
			<div class="mb-4">
				<label for="email" class="mb-1 block font-bold text-gray-100">Email</label>
				<input
					bind:value={email}
					type="email"
					id="email"
					name="email"
					class="w-full rounded-md border-2 border-gray-800 bg-transparent px-3 py-1 text-gray-100 placeholder-gray-400 transition-all duration-500 focus:border-yellow-400 focus:outline-none focus:ring-yellow-400"
					placeholder="enter your email"
					required
				/>
			</div>
			<div class="mb-4">
				<label for="message" class="mb-1 block font-bold text-gray-100">Message</label>
				<textarea
					bind:value={message}
					id="message"
					name="message"
					rows={innerWidth < 768 ? 3 : 5}
					class="w-full rounded-md border-2 border-gray-800 bg-transparent px-3 py-1 text-gray-100 placeholder-gray-400 transition-all duration-500 focus:border-yellow-400 focus:ring-yellow-400"
					placeholder="how can we help?"
					required
				></textarea>
			</div>
			<div class="flex items-center gap-2">
				<button
					type="submit"
					class="w-full rounded-lg bg-yellow-400 py-4 font-bold text-black transition duration-300 hover:bg-yellow-500 disabled:bg-gray-400"
					disabled={!isFormValid}
				>
					Send Message
				</button>
				{#if status}
					<span>{status}</span>
				{/if}
			</div>
		</form>
	</div>
</section>
