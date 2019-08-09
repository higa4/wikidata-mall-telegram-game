import TelegrafInlineMenu from 'telegraf-inline-menu'

import {Session, Persist} from '../lib/types'

import {buttonText} from '../lib/interface/menu'
import {infoHeader, labeledFloat} from '../lib/interface/formatted-strings'
import emoji from '../lib/interface/emojis'

import achievements from './achievements'
import applicants from './applicants'
import botStats from './bot-stats'
import employees from './employees'
import languages from './languages'
import shops from './shops'
import skills from './skills'

function menuText(ctx: any): string {
	const session = ctx.session as Session

	let text = ''
	text += infoHeader(ctx.wd.r('menu.menu'))
	text += '\n\n'

	text += labeledFloat(ctx.wd.r('other.money'), session.money, emoji.currency)
	text += '\n\n'

	text += '⚠️*BETA*\n'
	text += 'complete data reset may happen any time\n'
	text += 'please join the [chat](https://t.me/WikidataMallChat) to discuss features and bugs :)\n'

	return text
}

const menu = new TelegrafInlineMenu(menuText)
menu.setCommand('start')

function shopsButtonText(ctx: any): string {
	const persist = ctx.persist as Persist
	let text = ''
	text += emoji.shop
	text += ctx.wd.r('menu.shop').label()
	text += ' ('
	text += persist.shops.length
	text += ')'

	return text
}

menu.submenu(shopsButtonText, 'shops', shops)

menu.simpleButton(buttonText(emoji.mall + emoji.underConstruction, 'menu.mall'), 'mall', {
	doFunc: async ctx => ctx.answerCbQuery(emoji.underConstruction + 'soon…')
})

function applicantEmoji(ctx: any): string {
	const session = ctx.session as Session
	return session.applicants.length > 0 ? emoji.applicantsAvailable : emoji.applicantsEmpty
}

menu.submenu(buttonText(applicantEmoji, 'menu.applicant'), 'applicants', applicants, {
	hide: (ctx: any) => {
		const persist = ctx.persist as Persist
		return persist.shops.length === 0
	}
})

menu.submenu(buttonText(emoji.person, 'menu.employee'), 'employees', employees, {
	joinLastRow: true,
	hide: (ctx: any) => {
		const persist = ctx.persist as Persist
		return persist.shops.length === 0
	}
})

menu.submenu(buttonText(emoji.skill, 'menu.skill'), 'skill', skills, {
	hide: (ctx: any) => {
		const persist = ctx.persist as Persist
		return persist.shops.length === 0
	}
})

menu.submenu(buttonText(emoji.achievement, 'menu.achievement'), 'achievements', achievements, {
	joinLastRow: true
})

menu.submenu(buttonText(emoji.language, 'menu.language'), 'lang', languages)

menu.submenu(buttonText(emoji.stats, 'stat.stats'), 'botStats', botStats, {
	joinLastRow: true
})

menu.urlButton(buttonText(emoji.chat, 'menu.chat'), 'https://t.me/WikidataMallChat')

menu.urlButton(buttonText('🦑', 'other.github'), 'https://github.com/EdJoPaTo/wikidata-mall-telegram-game', {
	joinLastRow: true
})

export default menu
