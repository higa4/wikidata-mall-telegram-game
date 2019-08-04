import WikidataEntityReader from 'wikidata-entity-reader'
import WikidataEntityStore from 'wikidata-entity-store'

import {SkillInTraining} from '../types/skills'

import {countdownHourMinute} from './formatted-time'
import emojis from './emojis'

export function skillInTrainingString(ctx: any, skillInTraining: SkillInTraining): string {
	const {skill, category, endTimestamp} = skillInTraining
	const now = Date.now() / 1000

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

export function skillFinishedNotificationString(skillInTraining: SkillInTraining, entityStore: WikidataEntityStore, locale: string): string {
	const {skill, category} = skillInTraining

	let text = ''
	text += new WikidataEntityReader(entityStore.entity(`skill.${skill}`), locale).label()

	if (category) {
		text += ' '
		text += '('
		text += new WikidataEntityReader(entityStore.entity(category), locale).label()
		text += ')'
	}

	return text
}
