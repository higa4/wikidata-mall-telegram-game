import {Skills} from '../types/skills'

import {currentLevel} from './skill'

export function secondsBetweenApplicants(skills: Skills): number {
	const applicantSpeedLevel = currentLevel(skills, 'applicantSpeed')
	return 60 - (applicantSpeedLevel * 2)
}

export function maxDaysUntilRetirement(skills: Skills): number {
	const healthCareLevel = currentLevel(skills, 'healthCare')
	return 14 + healthCareLevel
}
