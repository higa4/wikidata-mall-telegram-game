import {Skills} from '../types/skills'

import * as fibonacci from '../math/fibonacci'

type Dictionary<T> = {[key: string]: T}

const SECONDS_IN_HOUR = 60 * 60

export function currentLevel(skills: Skills, skill: keyof Skills, category?: string): number {
	const content = skills[skill]

	if (!content) {
		return 0
	}

	if (typeof content === 'number') {
		return content
	}

	if (!category) {
		throw new TypeError('category has to be specified on category specific skill')
	}

	return content[category] || 0
}

export function collectorTotalLevel(skills: Skills): number {
	const {collector} = skills
	if (!collector) {
		return 0
	}

	return Object.values(collector)
		.reduce((a, b) => a + b, 0)
}

/**
 * Calculates the time needed to upgrade a skill with this current level. Time is in hours
 * @returns time in hours
 */
export function skillUpgradeTimeNeeded(currentLevel: number): number {
	return fibonacci.cached(currentLevel + 2)
}

export function skillUpgradeEndTimestamp(currentLevel: number, startTimestamp: number): number {
	const hoursNeeded = skillUpgradeTimeNeeded(currentLevel)
	const secondsNeeded = SECONDS_IN_HOUR * hoursNeeded
	return startTimestamp + secondsNeeded
}

/**
 * Increases the given skills level in `skills`.
 * Ensure category is set or not based on the `skill`!
 */
export function increaseLevelByOne(skills: Skills, skill: keyof Skills, category?: string): void {
	if (!skills[skill]) {
		if (category) {
			const initialContent: Dictionary<number> = {}
			initialContent[category] = 0
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

	if (!content[category!]) {
		content[category!] = 0
	}

	content[category!]++
}
