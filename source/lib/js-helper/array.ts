import randomItem = require('random-item')

export function randomUnusedEntry<T>(all: readonly T[], used: readonly T[] = []): T {
	const possible = all
		.filter(o => !used.includes(o))

	if (possible.length === 0) {
		throw new Error('no entries to chose from')
	}

	return randomItem(possible)
}
