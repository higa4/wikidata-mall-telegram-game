export function average(values: readonly number[]): number {
	if (values.length === 0) {
		return NaN
	}

	const sum = values.reduce((a, b) => a + b)
	return sum / values.length
}
