import {Skill, Skills, SkillInTraining} from '../types/skills'

import {currentLevel, skillUpgradeEndTimestamp, isSimpleSkill, categorySkillSpecificLevel} from '../game-math/skill'

export function isSkillInQueue(queue: SkillInTraining[], skill: Skill, category: string | undefined): boolean {
	return queue.some(o => o.skill === skill && o.category === category)
}

export function addSkillToQueue(queue: SkillInTraining[], skills: Skills, skill: Skill, category: string | undefined, now: number): void {
	if (isSkillInQueue(queue, skill, category)) {
		throw new Error('skill is already in queue')
	}

	const skillBefore: SkillInTraining | undefined = queue.slice(-1)[0]
	const level = isSimpleSkill(skill) ? currentLevel(skills, skill) : categorySkillSpecificLevel(skills, skill, category!)
	const endTimestamp = skillUpgradeEndTimestamp(level, skillBefore ? skillBefore.endTimestamp : now)
	queue.push({
		skill,
		category,
		endTimestamp
	})
}
