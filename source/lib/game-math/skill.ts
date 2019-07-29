import {Skills} from '../types/skills'

import * as fibonacci from '../math/fibonacci'

type Dictionary<T> = {[key: string]: T}

export function currentLevel(skills: Skills, skill: keyof Skills, product?: string): number {
	const content = skills[skill]

	if (!content) {
		return 0
	}

	if (typeof content === 'number') {
		return content
	}

	if (!product) {
		throw new TypeError('product has to be specified on product specific skill')
	}

	return content[product] || 0
}

export function collectorTotalLevel(skills: Skills): number {
	const {collector} = skills
	if (!collector) {
		return 0
	}

	return Object.values(collector)
		.reduce((a, b) => a + b)
}

/**
 * Calculates the time needed to upgrade a skill with this current level. Time is in hours
 * @returns time in hours
 */
export function skillUpgradeTimeNeeded(currentLevel: number): number {
	return fibonacci.cached(currentLevel + 2)
}

/**
 * Increases the given skills level in `skills`.
 * Ensure product is set or not based on the `skill`!
 */
export function increaseLevelByOne(skills: Skills, skill: keyof Skills, product?: string): void {
	if (!skills[skill]) {
		if (product) {
			const initialContent: Dictionary<number> = {}
			initialContent[product] = 0
			skills[skill] = initialContent as any
		} else {
			const initialContent = 0
			skills[skill] = initialContent as any
		}
	}

	if (typeof skills[skill] === 'number') {
		(skills[skill] as any) += 1
		return
	}

	const content = skills[skill] as Dictionary<number>

	if (!content[product!]) {
		content[product!] = 0
	}

	content[product!]++
}
