import {Skills} from '../types/skills'

import {currentLevel} from './skill'

export function secondsBetweenApplicants(skills: Skills): number {
	const applicantSpeedLevel = currentLevel(skills, 'applicantSpeed')
	return 300 / (applicantSpeedLevel + 1)
}

export function maxDaysUntilRetirement(skills: Skills): number {
	const healthCareLevel = currentLevel(skills, 'healthCare')
	return 14 + healthCareLevel
}
