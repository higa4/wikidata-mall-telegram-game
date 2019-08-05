export function scientificExponent(num: number): number {
	const exp = Math.floor(Math.log10(Math.abs(num)))
	const sciExp = Math.max(0, Math.floor(exp / 3) * 3)
	return sciExp
}
