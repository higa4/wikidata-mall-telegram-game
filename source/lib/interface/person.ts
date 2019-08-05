import WikidataEntityReader from 'wikidata-entity-reader'

import {Person, TalentName, Name} from '../types/people'
import {Session} from '../types'
import {Shop} from '../types/shop'

import {personalBonus} from '../game-math/personal'

import {percentBonusString} from './format-percent'
import {humanReadableTimestamp} from './formatted-time'

import emojis from './emojis'

export function personMarkdown(ctx: any, person: Person): string {
	const {__wikibase_language_code: locale} = ctx.session as Session
	const {name, hobby, retirementTimestamp, talents} = person

	let text = ''
	text += nameMarkdown(name)
	text += '\n\n'

	text += emojis.hobby
	text += '*'
	text += ctx.wd.r('person.hobby').label()
	text += '*'
	text += ': '
	text += ctx.wd.r(hobby).label()
	text += '\n'

	text += emojis.retirement
	text += '*'
	text += ctx.wd.r('person.retirement').label()
	text += '*\n  '
	text += humanReadableTimestamp(retirementTimestamp, locale)
	text += '\n'

	text += '\n'
	text += '*'
	text += ctx.wd.r('person.talent').label()
	text += '*'
	text += '\n'

	text += (Object.keys(talents) as TalentName[])
		.map(t => talentLine(ctx, t, talents[t]))
		.join('\n')

	return text
}

export function nameMarkdown(name: Name): string {
	const {given, family} = name
	return `*${given}* ${family}`
}

function talentLine(ctx: any, t: TalentName, percentage: number): string {
	const reader = ctx.wd.r(`person.talents.${t}`) as WikidataEntityReader
	return `${emojis[t]} ${reader.label()}: ${percentBonusString(percentage)}`
}

export function personInShopLine(shop: Shop, talent: TalentName): string {
	const person = shop.personal[talent]
	if (!person) {
		throw new Error(`There is no person in the shop assigned to the position + ${talent}`)
	}

	const {name, hobby} = person
	const namePart = nameMarkdown(name)
	const isHobby = hobby === shop.id
	const bonus = personalBonus(shop, talent)

	return `${percentBonusString(bonus)} ${isHobby ? emojis.hobby + ' ' : ''}${namePart}`
}
