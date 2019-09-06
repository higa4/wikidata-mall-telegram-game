import test, {ExecutionContext} from 'ava'

import {Skills, SkillInTraining, Skill} from '../../source/lib/types/skills'

import {addSkillToQueue, isSkillInQueue} from '../../source/lib/game-logic/skills'

function isSkillInQueueMacro(t: ExecutionContext, skill: Skill, category: string | undefined, expected: boolean): void {
	const queue: SkillInTraining[] = [
		{
			skill: 'logistics',
			endTimestamp: 400
		},
		{
			skill: 'collector',
			category: 'Q42',
			endTimestamp: 600
		}
	]

	t.is(isSkillInQueue(queue, skill, category), expected)
}

test('isSkillInQueue simple skill true', isSkillInQueueMacro, 'logistics', undefined, true)
test('isSkillInQueue complex skill true', isSkillInQueueMacro, 'collector', 'Q42', true)
test('isSkillInQueue simple skill false', isSkillInQueueMacro, 'applicantSpeed', undefined, false)
test('isSkillInQueue complex skill false', isSkillInQueueMacro, 'collector', 'Q5', false)

test('addSkillToQueue empty', t => {
	const skills: Skills = {}
	const queue: SkillInTraining[] = []
	addSkillToQueue(queue, skills, 'healthCare', undefined, 0)
	t.deepEqual(queue, [
		{
			skill: 'healthCare',
			category: undefined,
			endTimestamp: 3600
		}
	])
})

test('addSkillToQueue complex into empty', t => {
	const skills: Skills = {}
	const queue: SkillInTraining[] = []
	addSkillToQueue(queue, skills, 'collector', 'Q42', 0)
	t.deepEqual(queue, [
		{
			skill: 'collector',
			category: 'Q42',
			endTimestamp: 3600
		}
	])
})

test('addSkillToQueue with different skill before', t => {
	const skills: Skills = {}
	const queue: SkillInTraining[] = [{
		skill: 'logistics',
		endTimestamp: 400
	}]
	addSkillToQueue(queue, skills, 'healthCare', undefined, 666)
	t.deepEqual(queue, [
		{
			skill: 'logistics',
			endTimestamp: 400
		},
		{
			skill: 'healthCare',
			category: undefined,
			endTimestamp: 4000
		}
	])
})

test('addSkillToQueue with same skill before fails', t => {
	const skills: Skills = {}
	const queue: SkillInTraining[] = [{
		skill: 'healthCare',
		endTimestamp: 400
	}]

	t.throws(
		() => addSkillToQueue(queue, skills, 'healthCare', undefined, 666),
		/already in queue/
	)
})
