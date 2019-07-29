import TelegrafInlineMenu from 'telegraf-inline-menu'
import WikidataEntityReader from 'wikidata-entity-reader'

import {AchievementSet} from '../lib/types/achievements'
import {Session} from '../lib/types'

import {infoHeader, labeledTimestamp, humanReadableTimestamp} from '../lib/interface/formatted-strings'
import {menuPhoto} from '../lib/interface/menu'

function achievementSetPart(topic: WikidataEntityReader, set: AchievementSet | undefined, locale: string): string {
	if (!set || Object.keys(set).length === 1) {
		return ''
	}

	let text = ''
	text += '*'
	text += topic.label()
	text += '*'
	text += '\n'

	const entries = Object.keys(set)
	const lines = entries
		.map(o => `${o}: ${humanReadableTimestamp(set[o], locale)}`)

	text += lines
		.join('\n')

	text += '\n\n'
	return text
}

function generateParts(ctx: any): string[] {
	const {achievements, __wikibase_language_code: locale} = ctx.session as Session
	const parts: string[] = []

	parts.push(achievementSetPart(ctx.wd.r('other.money'), achievements.moneyCollected, locale))
	parts.push(achievementSetPart(ctx.wd.r('product.product'), achievements.productsInAssortment, locale))
	parts.push(achievementSetPart(ctx.wd.r('person.talents.purchasing'), achievements.productsBought, locale))

	const possibleParts = parts.filter(o => o)
	return possibleParts
}

function menuText(ctx: any): string {
	const {achievements, page, __wikibase_language_code: locale} = ctx.session as Session

	let text = ''
	text += infoHeader(ctx.wd.r('menu.achievement'))
	text += '\n\n'

	const parts = generateParts(ctx)
	const sanePage = Math.min(parts.length + 1, page)

	if (sanePage === 1) {
		text += labeledTimestamp(ctx.wd.r('achievement.gameStarted'), achievements.gameStarted, locale) + '\n'
	} else {
		text += parts[sanePage - 2]
	}

	return text
}

const menu = new TelegrafInlineMenu(menuText, {
	photo: menuPhoto('menu.achievement')
})

menu.pagination('page', {
	getCurrentPage: (ctx: any) => (ctx.session as Session).page,
	getTotalPages: ctx => generateParts(ctx).length + 1,
	setPage: (ctx: any, page) => {
		const session = ctx.session as Session
		session.page = page
	}
})

export default menu
