import WikidataEntityStore from 'wikidata-entity-store'

import {Notification} from '../types/notification'
import {Session, Persist} from '../types'

import {skillFinishedNotificationString} from '../interface/skill'

export function generateNotifications(session: Session, _: Persist, entityStore: WikidataEntityStore): readonly Notification[] {
	return [
		...generateSkill(session, entityStore)
	]
}

function generateSkill(session: Session, entityStore: WikidataEntityStore): readonly Notification[] {
	const result: Notification[] = []
	const {skillInTraining, __wikibase_language_code: locale} = session

	if (skillInTraining) {
		result.push({
			type: 'skillFinished',
			date: new Date(skillInTraining.endTimestamp * 1000),
			text: skillFinishedNotificationString(skillInTraining, entityStore, locale)
		})
	}

	return result
}
