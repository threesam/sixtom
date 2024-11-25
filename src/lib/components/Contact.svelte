<script lang="ts">
	let { store } = $props()

	let innerWidth = $state(0)
	let name = $state('')
	let email = $state('')
	let message = $state('')
	let status = $state('')

	async function submitForm(e: any) {
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

	$effect(() => {
		if (!!name && !!email && !!message) {
			store.toggle()
		}
	})
</script>

<svelte:window bind:innerWidth />

<section class="container w-full py-4 md:py-12" id="contact">
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
					class="placeholder:text-200 w-full bg-black px-3 py-1 ring-2 ring-gray-100 focus:bg-black focus:outline-none focus:ring-2 focus:ring-yellow-300"
					placeholder="What's your name?"
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
					class="placeholder:text-200 w-full bg-black px-3 py-1 ring-2 ring-gray-100 focus:bg-black focus:outline-none focus:ring-2 focus:ring-yellow-300"
					placeholder="And your email?"
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
					class="placeholder:text-200 w-full bg-black px-3 py-1 ring-2 ring-gray-100 focus:bg-black focus:outline-none focus:ring-2 focus:ring-yellow-300"
					placeholder="What can we help with?"
					required
				></textarea>
			</div>
			<div class="flex items-center gap-2">
				<button
					disabled={!name || !email || !message}
					type="submit"
					class="w-full bg-yellow-400 py-4 font-bold uppercase text-black transition duration-300 hover:bg-yellow-500 disabled:bg-gray-300 disabled:font-light"
				>
					{#if !name || !email || !message}
						Fill Out Fields
					{:else}
						Begin Convervation
					{/if}
				</button>
				{#if status}
					<span>{status}</span>
				{/if}
			</div>
		</form>
	</div>
</section>

<style>
	input:-webkit-autofill,
	textarea:-webkit-autofill {
		-webkit-text-fill-color: white !important; /* Autofill text color */
		-webkit-box-shadow: 0 0 0 30px black inset !important; /* Match input background color */
	}

	input:-webkit-autofill:focus,
	textarea:-webkit-autofill:focus {
		-webkit-text-fill-color: white !important;
		-webkit-box-shadow: 0 0 0 30px black inset !important;
		border-radius: inherit; /* Ensure styles respect the input's border radius */
	}
</style>
