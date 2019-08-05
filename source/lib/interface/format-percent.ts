export function percentString(percent: number): string {
	return (percent * 100).toFixed(1) + '%'
}

export function percentBonusString(percent: number): string {
	const plusMinusHundred = (percent - 1) * 100
	return `${plusMinusHundred >= 0 ? '+' : ''}${plusMinusHundred.toFixed(1)}%`
}
