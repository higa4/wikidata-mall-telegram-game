export type Dictionary<T> = {[key: string]: T}

export function sortDictByValue<T>(dict: Dictionary<T>, compareFn: (a: T, b: T) => number): Dictionary<T> {
	const orderedKeys = Object.keys(dict)
		.sort((a, b) => compareFn(dict[a], dict[b]))

	const result: Dictionary<T> = {}
	for (const key of orderedKeys) {
		result[key] = dict[key]
	}

	return result
}

export function sortDictByStringValue(dict: Dictionary<string>, locale?: string): Dictionary<string> {
	return sortDictByValue(dict, (a, b) => a.localeCompare(b, locale))
}

export function sortDictByNumericValue(dict: Dictionary<number>, reverse = false): Dictionary<number> {
	return sortDictByValue(dict, reverse ? (a, b) => b - a : (a, b) => a - b)
}
