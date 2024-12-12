<script lang="ts">
	import { scale, fade } from 'svelte/transition'
	import { cubicOut } from 'svelte/easing'

	import { sleep } from '$lib/client'
	import type { EventHandler, FormEventHandler } from 'svelte/elements'

	let innerWidth = $state(0)
	let name = $state('')
	let email = $state('')
	let message = $state('')
	let status = $state('')
	let isLoading = $state(false)

	// Form validation: Check if all required fields are filled
	let isFormValid = $derived(name.trim() !== '' && email.trim() !== '' && message.trim() !== '')

	let buttonText = $derived(isLoading ? 'Loading' : 'Send Message')

	async function submitForm(e: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		e.preventDefault()
		const response = await fetch('/api/send-email', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name, email, message })
		})

		isLoading = true
		const result = await response.json()

		isLoading = false
		status = result.status
	}

	// Watch for changes in status
	$effect(() => {
		if (status) {
			// wait for animation
			sleep(500).then(() => {
				name = ''
				email = ''
				message = ''
			})

			sleep(3000).then(() => (status = ''))
		}
	})
</script>

<svelte:window bind:innerWidth />

<section class="container w-full py-2 lg:py-12" id="contact">
	<div class="relative mx-auto max-w-lg">
		<h2 class="mb-8 text-center text-4xl font-bold text-white lg:mb-8 lg:text-5xl">Let's Talk</h2>
		<form class="mx-auto" onsubmit={submitForm}>
			<div class="mb-4">
				<label for="name" class="mb-1 block font-bold text-gray-100">name</label>
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
				<label for="email" class="mb-1 block font-bold text-gray-100">email</label>
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
				<label for="message" class="mb-1 block font-bold text-gray-100">message</label>
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
					{buttonText}
				</button>
			</div>
		</form>

		{#if status}
			<div
				class="absolute inset-0 z-10 grid place-content-center rounded-lg bg-black/90 text-gray-100"
				in:scale={{ duration: 200, easing: (t) => t * t }}
				out:fade={{ duration: 200 }}
			>
				<div class="max-w-md p-2">
					<p class="mb-2 text-center text-2xl lg:text-3xl">Thanks for contacting us!</p>
					<p class="text-center text-gray-200 lg:text-lg">Someone will get back to you shortly</p>
				</div>
			</div>
		{/if}
	</div>
</section>
