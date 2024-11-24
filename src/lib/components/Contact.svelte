<script lang="ts">
	let innerWidth = 0
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

<svelte:window bind:innerWidth />

<section class="container w-full py-4 md:py-12" id="contact">
	<div class="mx-auto max-w-lg">
		<h2 class="mb-4 text-center text-3xl font-bold text-white md:mb-8 md:text-5xl">Get In Touch</h2>
		<form class="mx-auto" on:submit|preventDefault={submitForm}>
			<div class="mb-4">
				<label for="name" class="mb-1 block font-bold text-gray-100">Name</label>
				<input
					bind:value={name}
					type="text"
					id="name"
					name="name"
					class="w-full border border-gray-300 px-3 py-1 focus:border-gray-500 focus:outline-none"
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
					class="w-full border border-gray-300 px-3 py-1 focus:border-gray-500 focus:outline-none"
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
					class="w-full border border-gray-300 px-3 py-1 focus:border-gray-500 focus:outline-none"
					required
				></textarea>
			</div>
			<div class="flex items-center gap-2">
				<button
					type="submit"
					class="w-full bg-yellow-400 py-4 font-bold text-black transition duration-300 hover:bg-yellow-500"
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
