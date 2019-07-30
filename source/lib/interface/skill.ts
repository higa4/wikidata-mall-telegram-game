import {SkillInTraining, Skills} from '../types/skills'

import {currentLevel, skillUpgradeEndTimestamp} from '../game-math/skill'

import {countdownHourMinute} from './formatted-time'
import emojis from './emojis'

export function skillInTrainingString(ctx: any, skills: Skills, skillInTraining: SkillInTraining): string {
	const {skill, category, startTimestamp} = skillInTraining
	const now = Date.now() / 1000

	const level = currentLevel(skills, skill, category)
	const endTimestamp = skillUpgradeEndTimestamp(level, startTimestamp)

	let text = ''
	text += '*'
	text += ctx.wd.r('skill.training').label()
	text += '*'
	text += '\n'

	text += ctx.wd.r(`skill.${skill}`).label()

	if (category) {
		text += ' '
		text += '('
		text += ctx.wd.r(category).label()
		text += ')'
	}

	text += '\n'
	text += emojis.countdown
	text += countdownHourMinute(endTimestamp - now)

	return text
}
