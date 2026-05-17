// Progressive enhancement for forms marked [data-enhance-form].
// Without this script the form still works via native HTML submission;
// with it, you get inline "Sending..." + result rendering without a page reload.
//
// Loaded with `<script defer>` so it doesn't block FCP/LCP.
;(function () {
	'use strict'

	function init() {
		var forms = document.querySelectorAll('form[data-enhance-form]')
		for (var i = 0; i < forms.length; i++) {
			enhance(forms[i])
		}
	}

	function enhance(form) {
		// Mark this submission as having reached the lazy script. Server only
		// enforces the time-trap layer when this flag is set — otherwise a real
		// visitor whose JS didn't load (ad-blocker, race) would silent-fail.
		var enhanced = form.querySelector('[data-form-enhanced]')
		if (enhanced) enhanced.value = '1'
		var startedAt = form.querySelector('[data-form-started-at]')
		if (startedAt) startedAt.value = String(Date.now())

		var submitButton = form.querySelector('[data-enhance-submit]')
		var resultBox = form.parentElement
			? form.parentElement.querySelector('[data-enhance-result]')
			: null
		var originalLabel = submitButton ? submitButton.textContent : ''

		form.addEventListener('submit', function (event) {
			event.preventDefault()
			if (submitButton && submitButton.disabled) return
			if (submitButton) {
				submitButton.disabled = true
				submitButton.textContent = 'Sending…'
			}
			clearResult(resultBox)

			var formData = new FormData(form)
			var action = form.getAttribute('action') || ''

			fetch(action, {
				method: 'POST',
				body: formData,
				headers: { 'x-sveltekit-action': 'true' }
			})
				.then(function (res) {
					return res.text().then(function (text) {
						return { status: res.status, text: text }
					})
				})
				.then(function (raw) {
					var parsed = parseSvelteKitAction(raw.text)
					var ok = parsed && parsed.status === 'success'
					render(resultBox, ok ? 'success' : 'error', parsed && parsed.message)
					if (ok) form.reset()
					if (submitButton) {
						submitButton.disabled = false
						submitButton.textContent = originalLabel
					}
				})
				.catch(function () {
					render(resultBox, 'error', 'Something went wrong. Try again in a moment.')
					if (submitButton) {
						submitButton.disabled = false
						submitButton.textContent = originalLabel
					}
				})
		})
	}

	function parseSvelteKitAction(text) {
		// SvelteKit action responses: {"type":"success","status":200,"data":"<devalue>"}.
		// devalue encodes flat objects as an array where index 0 is the root and
		// other indices are referenced positions; walk it back to a plain object.
		try {
			var outer = JSON.parse(text)
			if (!outer || !outer.data) return null
			var payload = typeof outer.data === 'string' ? JSON.parse(outer.data) : outer.data
			return resolveDevalue(payload)
		} catch (e) {
			return null
		}
	}

	function resolveDevalue(value) {
		if (Array.isArray(value)) {
			var resolved = {}
			var root = value[0]
			if (root && typeof root === 'object') {
				for (var key in root) {
					var v = root[key]
					resolved[key] = typeof v === 'number' ? value[v] : v
				}
			}
			return resolved
		}
		return value
	}

	function clearResult(box) {
		if (!box) return
		while (box.firstChild) box.removeChild(box.firstChild)
	}

	function render(box, kind, message) {
		if (!box) return
		clearResult(box)
		var p = document.createElement('p')
		p.className = 'mt-4 text-base ' + (kind === 'success' ? 'text-coin' : 'text-rose-400')
		// Use textContent so server-supplied message strings can't inject HTML.
		p.textContent =
			message || (kind === 'success' ? "You're on the list." : 'Something went wrong.')
		box.appendChild(p)
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init)
	} else {
		init()
	}
})()
