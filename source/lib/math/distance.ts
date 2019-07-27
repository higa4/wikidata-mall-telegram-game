import {average} from './number-array'

export function distanceDiversity(values: readonly number[], averageMin = 0.2): number {
	const arr = distanceSteps(values)
	const avg = Math.max(average(arr) || averageMin, averageMin)
	const max = Math.max(1, ...arr)

	return avg / max
}

export function distanceSteps(values: readonly number[]): number[] {
	const sorted = [...values].sort((a, b) => a - b)
	const distanceArr = sorted.reduce((curr: number[], add, i, arr) => {
		if (i === 0) {
			return curr
		}

		const distance = add - arr[i - 1]
		curr.push(distance)

		return curr
	}, [])

	return distanceArr
}
