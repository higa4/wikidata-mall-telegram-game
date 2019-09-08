import test, {ExecutionContext} from 'ava'

import {Skills, Skill, SkillInTraining} from '../../source/lib/types/skills'

import {currentLevel, skillUpgradeTimeNeeded, increaseLevelByOne, skillUpgradeEndTimestamp, categorySkillSpecificLevel, entriesInSkillQueue, levelAfterSkillQueue} from '../../source/lib/game-math/skill'

const emptySkills: Skills = {}
const exampleSkills: Skills = {
	applicantSpeed: 2,
	collector: {
		Q2: 5,
		Q5: 3
	}
}

test('currentLevel 0 from unset categoryless skill', t => {
	t.is(currentLevel(emptySkills, 'applicantSpeed'), 0)
})

test('currentLevel 0 from unset category skill', t => {
	t.is(currentLevel(emptySkills, 'collector'), 0)
})

test('currentLevel correct on categoryless skill', t => {
	t.is(currentLevel(exampleSkills, 'applicantSpeed'), 2)
})

test('currentLevel correct on category skill', t => {
	t.is(currentLevel(exampleSkills, 'collector'), 8)
})

test('categorySkillSpecificLevel 0 from unset skill', t => {
	t.is(categorySkillSpecificLevel(emptySkills, 'collector', 'Q42'), 0)
})

test('categorySkillSpecificLevel 0 when not trained yet', t => {
	t.is(categorySkillSpecificLevel(exampleSkills, 'collector', 'Q42'), 0)
})

test('categorySkillSpecificLevel correct', t => {
	t.is(categorySkillSpecificLevel(exampleSkills, 'collector', 'Q5'), 3)
})

test('skillUpgradeTimeNeeded examples', t => {
	t.is(skillUpgradeTimeNeeded(0), 1)
	t.is(skillUpgradeTimeNeeded(1), 2)
	t.is(skillUpgradeTimeNeeded(2), 3)
	t.is(skillUpgradeTimeNeeded(3), 5)
	t.is(skillUpgradeTimeNeeded(4), 8)
})

test('skill', t => {
	t.is(skillUpgradeEndTimestamp(0, 10000000), 10000000 + (60 * 60 * 1))
	t.is(skillUpgradeEndTimestamp(1, 10000000), 10000000 + (60 * 60 * 2))
	t.is(skillUpgradeEndTimestamp(2, 10000000), 10000000 + (60 * 60 * 3))
})

test('increaseLevelByOne categoryless not yet trained', t => {
	const skills: Skills = JSON.parse(JSON.stringify(emptySkills))
	increaseLevelByOne(skills, 'applicantSpeed')
	t.is(skills.applicantSpeed, 1)
})

test('increaseLevelByOne categoryless trained', t => {
	const skills: Skills = JSON.parse(JSON.stringify(exampleSkills))
	increaseLevelByOne(skills, 'applicantSpeed')
	t.is(skills.applicantSpeed, 3)
})

test('increaseLevelByOne with category never trained', t => {
	const skills: Skills = JSON.parse(JSON.stringify(emptySkills))
	increaseLevelByOne(skills, 'collector', 'Q5')
	t.deepEqual(skills.collector, {
		Q5: 1
	})
})

test('increaseLevelByOne with category not yet trained', t => {
	const skills: Skills = JSON.parse(JSON.stringify(exampleSkills))
	increaseLevelByOne(skills, 'collector', 'Q42')
	t.is(skills.collector!.Q42, 1)
})

test('increaseLevelByOne with category trained', t => {
	const skills: Skills = JSON.parse(JSON.stringify(exampleSkills))
	increaseLevelByOne(skills, 'collector', 'Q5')
	t.is(skills.collector!.Q5, 4)
})

function entriesInSkillQueueMacro(t: ExecutionContext, skill: Skill, category: string | undefined, expected: number): void {
	const queue: SkillInTraining[] = [
		{
			skill: 'logistics',
			endTimestamp: 400
		},
		{
			skill: 'collector',
			category: 'Q42',
			endTimestamp: 600
		},
		{
			skill: 'logistics',
			endTimestamp: 800
		}
	]

	t.is(entriesInSkillQueue(queue, skill, category), expected)
}

test('entriesInSkillQueue simple skill true', entriesInSkillQueueMacro, 'logistics', undefined, 2)
test('entriesInSkillQueue complex skill true', entriesInSkillQueueMacro, 'collector', 'Q42', 1)
test('entriesInSkillQueue simple skill false', entriesInSkillQueueMacro, 'applicantSpeed', undefined, 0)
test('entriesInSkillQueue complex skill false', entriesInSkillQueueMacro, 'collector', 'Q5', 0)

function levelAfterSkillQueueMacro(t: ExecutionContext, skill: Skill, category: string | undefined, expected: number): void {
	const queue: SkillInTraining[] = [
		{
			skill: 'logistics',
			endTimestamp: 400
		},
		{
			skill: 'collector',
			category: 'Q42',
			endTimestamp: 600
		},
		{
			skill: 'logistics',
			endTimestamp: 800
		},
		{
			skill: 'healthCare',
			endTimestamp: 900
		}
	]

	const skills: Skills = {
		logistics: 2,
		collector: {
			Q5: 3,
			Q42: 1
		}
	}

	t.is(levelAfterSkillQueue(skills, queue, skill, category), expected)
}

test('levelAfterSkillQueue simple', levelAfterSkillQueueMacro, 'logistics', undefined, 4)
test('levelAfterSkillQueue complex', levelAfterSkillQueueMacro, 'collector', 'Q42', 2)
test('levelAfterSkillQueue not in queue', levelAfterSkillQueueMacro, 'collector', 'Q5', 3)
test('levelAfterSkillQueue not in skills', levelAfterSkillQueueMacro, 'healthCare', undefined, 1)
