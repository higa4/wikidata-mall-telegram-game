export type Dictionary<T> = {[key: string]: T}

export function sortDictByValue(dict: Dictionary<string>, locale?: string): Dictionary<string> {
	const orderedKeys = Object.keys(dict)
		.sort((a, b) => dict[a].localeCompare(dict[b], locale))

	const result: Dictionary<string> = {}
	for (const key of orderedKeys) {
		result[key] = dict[key]
	}

	return result
}

