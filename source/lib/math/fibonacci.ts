export function stateful(initialValue = 1): (next: number) => number {
	let last = initialValue
	return next => {
		const result = next + last
		last = next
		return result
	}
}
