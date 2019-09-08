import {Skill, Skills, SkillInTraining} from '../types/skills'

import {skillUpgradeEndTimestamp, levelAfterSkillQueue} from '../game-math/skill'

export function addSkillToQueue(queue: SkillInTraining[], skills: Skills, skill: Skill, category: string | undefined, now: number): void {
	const skillBefore: SkillInTraining | undefined = queue.slice(-1)[0]
	const level = levelAfterSkillQueue(skills, queue, skill, category)
	const endTimestamp = skillUpgradeEndTimestamp(level, skillBefore ? skillBefore.endTimestamp : now)
	queue.push({
		skill,
		category,
		endTimestamp
	})
}
