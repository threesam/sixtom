<script lang="ts">
	import { scale, fade } from 'svelte/transition'
	import { cubicOut } from 'svelte/easing'

	import { sleep } from '$lib/client'

	let innerWidth = $state(0)
	let name = $state('')
	let email = $state('')
	let message = $state('')
	let status = $state('')

	// Honeypot field (should remain empty for humans)
	let honeypot = $state('')

	// Prevent duplicate submissions
	let isSubmitting = $state(false)

	// Form validation: Check if all required fields are filled
	let isFormValid = $derived(name.trim() !== '' && email.trim() !== '' && message.trim() !== '')

	let buttonText = $derived(isSubmitting ? 'Sending…' : 'Book Call')

	async function submitForm(e: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		e.preventDefault()

		// Guard against duplicate submits
		if (isSubmitting) return

		// If honeypot is filled, silently succeed without sending
		if (honeypot.trim() !== '') {
			status = 'Message sent successfully!'
			return
		}

		isSubmitting = true
		try {
			const response = await fetch('/api/send-email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify({ name, email, message, website: honeypot })
			})

			const result = await response.json().catch(() => ({ status: 'Message sent successfully!' }))
			status = result?.status ?? 'Message sent successfully!'
		} catch (err) {
			status = 'Error sending message. Please try again later.'
		} finally {
			isSubmitting = false
		}
	}

	// Watch for changes in status
	$effect(() => {
		if (status) {
			// wait for animation
			sleep(500).then(() => {
				name = ''
				email = ''
				message = ''
				honeypot = ''
			})

			sleep(3000).then(() => (status = ''))
		}
	})
</script>

<svelte:window bind:innerWidth />

<section class="container w-full py-2 xl:py-12" id="contact">
	<div class="relative mx-auto max-w-lg">
		<h2 class="mb-3 text-center text-4xl font-bold text-white xl:text-5xl">Book a Call</h2>
		<p class="mb-8 text-center text-sm text-gray-300 xl:text-base">
			Tell me what you sell, what is stuck, and what needs to move now.
		</p>
		<form class="mx-auto" onsubmit={submitForm}>
			<div class="mb-4">
				<label for="name" class="mb-1 block font-bold text-gray-100">name</label>
				<input
					bind:value={name}
					type="text"
					id="name"
					name="name"
					class="w-full rounded-md border-2 border-gray-800 bg-transparent px-3 py-1 text-gray-100 placeholder-gray-400 transition-all duration-500 focus:border-yellow-400 focus:ring-yellow-400 focus:outline-none"
					placeholder="your name"
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
					class="w-full rounded-md border-2 border-gray-800 bg-transparent px-3 py-1 text-gray-100 placeholder-gray-400 transition-all duration-500 focus:border-yellow-400 focus:ring-yellow-400 focus:outline-none"
					placeholder="best email"
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
					placeholder="What do you sell? Who is your ideal buyer? What is the biggest bottleneck right now?"
					required
				></textarea>
			</div>
			<!-- Honeypot field: hidden from users, visible to bots -->
			<div style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden;">
				<label for="website">Website</label>
				<input
					id="website"
					name="website"
					type="text"
					tabindex="-1"
					autocomplete="off"
					bind:value={honeypot}
				/>
			</div>
			<div class="flex items-center gap-2">
				<button
					type="submit"
					class="w-full rounded-lg bg-yellow-400 py-4 font-bold text-black transition duration-300 hover:bg-yellow-500 disabled:bg-gray-400"
					disabled={!isFormValid || isSubmitting}
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
					<p class="mb-2 text-center text-2xl xl:text-4xl">Thanks for reaching out.</p>
					<p class="text-center text-gray-200 xl:text-lg">
						I will follow up with next steps shortly.
					</p>
				</div>
			</div>
		{/if}
	</div>
</section>
