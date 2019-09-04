import {markdown as format} from 'telegram-format'
import TelegrafInlineMenu from 'telegraf-inline-menu'

import {Session} from '../lib/types'

import * as userInfo from '../lib/data/user-info'
import * as userMalls from '../lib/data/malls'

import {MALL_MIN_PEOPLE, MALL_MAX_PEOPLE} from '../lib/game-math/constants'

import {parseTitle} from '../lib/game-logic/mall'

import {buttonText, menuPhoto} from '../lib/interface/menu'
import {emojis} from '../lib/interface/emojis'
import {infoHeader, labeledFloat} from '../lib/interface/formatted-strings'

const DONATION_AMOUNT = 1000000

async function menuText(ctx: any): Promise<string> {
	const {__wikibase_language_code: locale} = ctx.session as Session
	const mall = await userMalls.getMallOfUser(ctx.from.id)
	if (!mall) {
		throw new Error('You are not part of a mall')
	}

	const mallTitle = format.escape(parseTitle(mall.chat.title))
	const memberInfos = (await Promise.all(
		mall.member.map(async o => userInfo.get(o))
	))

	let text = ''
	text += infoHeader(ctx.wd.r('menu.mall'), {titlePrefix: emojis.mall})
	text += '\n\n'

	text += format.bold(mallTitle)
	text += '\n'

	text += labeledFloat(ctx.wd.r('other.money'), mall.money, emojis.currency)
	text += '\n\n'

	text += format.bold(
		ctx.wd.r('mall.participation').label()
	)
	text += ' '
	text += '('
	text += mall.member.length
	text += ')'
	text += '\n'
	text += memberInfos
		.map(o => o ? o.first_name : '??')
		.map(o => format.escape(o))
		.sort((a, b) => a.localeCompare(b, locale === 'wikidatanish' ? 'en' : locale))
		.map(o => `  ${o}`)
		.join('\n')
	text += '\n\n'

	if (mall.member.length < MALL_MIN_PEOPLE) {
		text += emojis.warning
		text += mall.member.length
		text += ' '
		text += ctx.wd.r('mall.participation').label()
		text += ' ('
		text += MALL_MIN_PEOPLE
		text += ' - '
		text += MALL_MAX_PEOPLE
		text += ')'
	}

	return text
}

const menu = new TelegrafInlineMenu(menuText, {
	photo: menuPhoto('menu.mall')
})

menu.button(buttonText(emojis.currency, 'mall.donation'), 'donate', {
	hide: async (ctx: any) => {
		const session = ctx.session as Session
		if (session.money < DONATION_AMOUNT * 2) {
			return true
		}

		const mall = await userMalls.getMallOfUser(ctx.from.id)
		return Boolean(mall && mall.money > DONATION_AMOUNT * 10)
	},
	doFunc: async (ctx: any) => {
		const session = ctx.session as Session
		if (session.money < DONATION_AMOUNT * 2) {
			return
		}

		const mallId = await userMalls.getMallIdOfUser(ctx.from.id)
		if (!mallId) {
			throw new Error('user not part of a mall')
		}

		const mall = (await userMalls.get(mallId))!
		mall.money += DONATION_AMOUNT
		session.money -= DONATION_AMOUNT
		await userMalls.set(mallId, mall)
	}
})

menu.urlButton(
	buttonText(emojis.wikidataItem, 'menu.wikidataItem'),
	(ctx: any) => ctx.wd.r('menu.mall').url()
)

export default menu
