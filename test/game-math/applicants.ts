import test, {ExecutionContext} from 'ava'

import {Skills} from '../../source/lib/types/skills'

import {secondsBetweenApplicants, maxDaysUntilRetirement} from '../../source/lib/game-math/applicant'

function secondsBetweenApplicantsMacro(t: ExecutionContext, applicantSpeedLevel: number, expected: number): void {
	const skills: Skills = {applicantSpeed: applicantSpeedLevel}
	t.is(secondsBetweenApplicants(skills), expected)
}

test('secondsBetweenApplicants level 0', secondsBetweenApplicantsMacro, 0, 60)
test('secondsBetweenApplicants level 5', secondsBetweenApplicantsMacro, 5, 50)
test('secondsBetweenApplicants level 10', secondsBetweenApplicantsMacro, 10, 40)

function maxDaysUntilRetirementMacro(t: ExecutionContext, healthCareLevel: number, expected: number): void {
	const skills: Skills = {healthCare: healthCareLevel}
	t.is(maxDaysUntilRetirement(skills), expected)
}

test('maxDaysUntilRetirement level 0', maxDaysUntilRetirementMacro, 0, 14)
test('maxDaysUntilRetirement level 5', maxDaysUntilRetirementMacro, 5, 19)
test('maxDaysUntilRetirement level 10', maxDaysUntilRetirementMacro, 10, 24)
