import {Skills, CategorySkill, SimpleSkill, SIMPLE_SKILLS, Skill, CATEGORY_SKILLS} from '../types/skills'

import {HOUR_IN_SECONDS} from '../math/timestamp-constants'
import * as fibonacci from '../math/fibonacci'

type Dictionary<T> = {[key: string]: T}

export function isSimpleSkill(skill: Skill): skill is SimpleSkill {
	return (SIMPLE_SKILLS as string[]).includes(skill)
}

export function isCategorySkill(skill: Skill): skill is CategorySkill {
	return (CATEGORY_SKILLS as string[]).includes(skill)
}

export function currentLevel(skills: Skills, skill: SimpleSkill | CategorySkill): number {
	const content = skills[skill]
	if (!content) {
		return 0
	}

	if (typeof content === 'number') {
		return content
	}

	return Object.values(content)
		.reduce((a, b) => a + b, 0)
}

export function categorySkillSpecificLevel(skills: Skills, skill: CategorySkill, category: string): number {
	const content = skills[skill]
	if (!content) {
		return 0
	}

	return content[category] || 0
}

export function collectorTotalLevel(skills: Skills): number {
	return currentLevel(skills, 'collector')
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
	const secondsNeeded = hoursNeeded * HOUR_IN_SECONDS
	return startTimestamp + secondsNeeded
}

/**
 * Increases the given skills level in `skills`.
 */
export function increaseLevelByOne(skills: Skills, skill: SimpleSkill): void
export function increaseLevelByOne(skills: Skills, skill: CategorySkill, category: string): void
export function increaseLevelByOne(skills: Skills, skill: SimpleSkill | CategorySkill, category?: string): void {
	if (!skills[skill]) {
		if (isCategorySkill(skill)) {
			const initialContent: Dictionary<number> = {}
			initialContent[category!] = 0
			skills[skill] = initialContent as any
		} else {
			const initialContent = 0
			skills[skill] = initialContent as any
		}
	}

	if (isSimpleSkill(skill)) {
		skills[skill]! += 1
		return
	}

	const content = skills[skill]!

	if (!content[category!]) {
		content[category!] = 0
	}

	content[category!]++
}
