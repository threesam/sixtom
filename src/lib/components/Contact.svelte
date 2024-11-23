<script lang="ts">
	let name = ''
	let email = ''
	let message = ''
	let status = ''

	async function submitForm() {
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

<section id="contact" class="bg-gray-100 py-20">
	<div class="container mx-auto px-4">
		<h2 class="mb-12 text-center text-3xl font-bold text-gray-900">Get In Touch</h2>
		<form class="mx-auto max-w-lg" on:submit|preventDefault={submitForm}>
			<div class="mb-4">
				<label for="name" class="mb-2 block font-bold text-gray-700">Name</label>
				<input
					bind:value={name}
					type="text"
					id="name"
					name="name"
					class="w-full border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
					required
				/>
			</div>
			<div class="mb-4">
				<label for="email" class="mb-2 block font-bold text-gray-700">Email</label>
				<input
					bind:value={email}
					type="email"
					id="email"
					name="email"
					class="w-full border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
					required
				/>
			</div>
			<div class="mb-4">
				<label for="message" class="mb-2 block font-bold text-gray-700">Message</label>
				<textarea
					bind:value={message}
					id="message"
					name="message"
					rows="4"
					class="w-full border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
					required
				></textarea>
			</div>
			<div class="flex items-center gap-2">
				<button
					type="submit"
					class="bg-gray-900 px-6 py-3 font-bold text-white transition duration-300 hover:bg-gray-800"
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
