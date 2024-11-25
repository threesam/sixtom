export function createToggleStore() {
	const state = $state({
		isActive: false
	})

	return {
		get isActive() {
			return state.isActive
		},
		toggle() {
			state.isActive = !state.isActive
		},
		set(value: boolean) {
			state.isActive = value
		}
	}
}
