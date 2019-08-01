import TelegrafInlineMenu from 'telegraf-inline-menu'
import WikidataEntityReader from 'wikidata-entity-reader'

import {Achievements, AchievementSet} from '../lib/types/achievements'
import {Session} from '../lib/types'

import {infoHeader, labeledTimestamp, humanReadableTimestamp} from '../lib/interface/formatted-strings'
import {menuPhoto, buttonText} from '../lib/interface/menu'
import emojis from '../lib/interface/emojis'

function achievementSetPart(topic: WikidataEntityReader, set: AchievementSet | undefined, locale: string): string {
	if (!set || Object.keys(set).length === 0) {
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

function simpleAchievementPage(ctx: any, achievements: Achievements, locale: string): string {
	let text = ''

	text += labeledTimestamp(ctx.wd.r('achievement.gameStarted'), achievements.gameStarted, locale) + '\n'

	return text
}

function generatePages(ctx: any): string[] {
	const {achievements, __wikibase_language_code: locale} = ctx.session as Session
	const parts: string[] = []

	parts.push(simpleAchievementPage(ctx, achievements, locale))

	parts.push(achievementSetPart(ctx.wd.r('other.money'), achievements.moneyCollected, locale))
	parts.push(achievementSetPart(ctx.wd.r('product.product'), achievements.productsInAssortment, locale))
	parts.push(achievementSetPart(ctx.wd.r('person.talents.purchasing'), achievements.productsBought, locale))

	const possibleParts = parts.filter(o => o)
	return possibleParts
}

function menuText(ctx: any): string {
	const {page} = ctx.session as Session

	let text = ''
	text += infoHeader(ctx.wd.r('menu.achievement'))
	text += '\n\n'

	const allPages = generatePages(ctx)
	const sanePage = Math.min(allPages.length, page)

	text += allPages[sanePage - 1]

	return text
}

const menu = new TelegrafInlineMenu(menuText, {
	photo: menuPhoto('menu.achievement')
})

menu.pagination('page', {
	getCurrentPage: (ctx: any) => (ctx.session as Session).page,
	getTotalPages: ctx => generatePages(ctx).length,
	setPage: (ctx: any, page) => {
		const session = ctx.session as Session
		session.page = page
	}
})

menu.urlButton(
	buttonText(emojis.wikidataItem, 'menu.wikidataItem'),
	(ctx: any) => ctx.wd.r('menu.achievement').url()
)

export default menu
