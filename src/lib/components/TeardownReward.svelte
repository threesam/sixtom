<script lang="ts">
	import { grandSlam, site } from '$lib/content'

	// The home page ships zero client JS (csr = false), so the disclosure is the
	// native popover: popovertarget needs no script, and the platform supplies
	// Esc, light-dismiss and focus handling. Browsers without it render the panel
	// inline instead of hiding it, which is the right way to fail for a term the
	// buyer is entitled to read.
	let { class: className = '' }: { class?: string } = $props()

	const { close } = grandSlam
	// Rendered on both / and /notify; a literal id would collide the moment two
	// instances shared a page.
	const PANEL_ID = $props.id()
</script>

<p class={className}>
	{close.rewardBefore}
	<button
		type="button"
		popovertarget={PANEL_ID}
		class="text-fg hover:decoration-accent focus-visible:ring-accent cursor-pointer rounded-sm underline decoration-dotted underline-offset-4 focus-visible:ring-2 focus-visible:outline-none"
	>
		{site.teardown.creditNote}<span class="sr-only">&nbsp;— see terms</span>
	</button>{close.rewardAfter}
</p>

<div
	id={PANEL_ID}
	popover
	class="border-border bg-surface text-fg-muted m-auto w-[calc(100vw-3rem)] max-w-sm rounded-lg border p-5 text-base leading-relaxed shadow-xl backdrop:bg-black/60"
>
	<p>{close.creditTerms}</p>
	<a
		href="/terms"
		data-umami-event="reward_terms_link"
		class="text-fg mt-4 inline-block text-sm underline underline-offset-4">read the full terms →</a
	>
</div>
