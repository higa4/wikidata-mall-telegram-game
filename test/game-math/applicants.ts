import test, {ExecutionContext} from 'ava'

import {Skills} from '../../source/lib/types/skills'

import {secondsBetweenApplicants, maxDaysUntilRetirement} from '../../source/lib/game-math/applicant'

function secondsBetweenApplicantsMacro(t: ExecutionContext, applicantSpeedLevel: number, expected: number): void {
	const skills: Skills = {applicantSpeed: applicantSpeedLevel}
	t.is(secondsBetweenApplicants(skills), expected)
}

test('secondsBetweenApplicants level 0', secondsBetweenApplicantsMacro, 0, 300)
test('secondsBetweenApplicants level 5', secondsBetweenApplicantsMacro, 5, 50)
test('secondsBetweenApplicants level 9', secondsBetweenApplicantsMacro, 9, 30)
test('secondsBetweenApplicants level 14', secondsBetweenApplicantsMacro, 14, 20)
test('secondsBetweenApplicants level 24', secondsBetweenApplicantsMacro, 24, 12)

function maxDaysUntilRetirementMacro(t: ExecutionContext, healthCareLevel: number, expected: number): void {
	const skills: Skills = {healthCare: healthCareLevel}
	t.is(maxDaysUntilRetirement(skills), expected)
}

test('maxDaysUntilRetirement level 0', maxDaysUntilRetirementMacro, 0, 6)
test('maxDaysUntilRetirement level 5', maxDaysUntilRetirementMacro, 5, 16)
test('maxDaysUntilRetirement level 10', maxDaysUntilRetirementMacro, 10, 26)
test('maxDaysUntilRetirement level 15', maxDaysUntilRetirementMacro, 15, 36)
test('maxDaysUntilRetirement level 25', maxDaysUntilRetirementMacro, 25, 56)
