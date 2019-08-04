import WikidataEntityReader from 'wikidata-entity-reader'
import WikidataEntityStore from 'wikidata-entity-store'

import {Notification} from '../types/notification'
import {Session, Persist} from '../types'
import {Shop} from '../types/shop'

import {shopProductsEmptyTimestamps} from '../game-math/shop'

import {skillFinishedNotificationString} from '../interface/skill'

export function generateNotifications(session: Session, persist: Persist, entityStore: WikidataEntityStore): readonly Notification[] {
	const {__wikibase_language_code: locale} = session

	return [
		...generateProductsEmpty(persist.shops, entityStore, locale),
		...generateSkill(session, entityStore)
	]
}

function generateProductsEmpty(shops: readonly Shop[], entityStore: WikidataEntityStore, locale: string): readonly Notification[] {
	return shops.flatMap(s => generateProductsEmptyShop(s, entityStore, locale))
}

function generateProductsEmptyShop(shop: Shop, entityStore: WikidataEntityStore, locale: string): readonly Notification[] {
	const emptyTimestamps = shopProductsEmptyTimestamps(shop)
	const max = Math.max(...emptyTimestamps)
	if (max < 1) {
		return []
	}

	const text = new WikidataEntityReader(entityStore.entity(shop.id), locale).label()

	return [{
		type: 'storeProductsEmpty',
		date: new Date(max * 1000),
		text
	}]
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
