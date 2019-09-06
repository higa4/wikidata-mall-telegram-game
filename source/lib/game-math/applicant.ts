import {Skills} from '../types/skills'

import {currentLevel} from './skill'

export function applicantSeats(skills: Skills): number {
	const level = currentLevel(skills, 'applicantSeats')
	return 2 + level
}

export function secondsBetweenApplicants(skills: Skills): number {
	const applicantSpeedLevel = currentLevel(skills, 'applicantSpeed')
	return 300 / (applicantSpeedLevel + 1)
}

export function maxDaysUntilRetirement(skills: Skills): number {
	const healthCareLevel = currentLevel(skills, 'healthCare')
	return 6 + (healthCareLevel * 2)
}
