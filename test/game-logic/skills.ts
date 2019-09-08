import test from 'ava'

import {Skills, SkillInTraining} from '../../source/lib/types/skills'

import {addSkillToQueue} from '../../source/lib/game-logic/skills'

test('addSkillToQueue simple into empty', t => {
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

test('addSkillToQueue with same skill before', t => {
	const skills: Skills = {}
	const queue: SkillInTraining[] = [{
		skill: 'healthCare',
		endTimestamp: 400
	}]
	addSkillToQueue(queue, skills, 'healthCare', undefined, 666)

	t.deepEqual(queue, [
		{
			skill: 'healthCare',
			endTimestamp: 400
		},
		{
			skill: 'healthCare',
			category: undefined,
			endTimestamp: 400 + 7200
		}
	])
})
