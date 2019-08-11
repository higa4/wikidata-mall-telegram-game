import TelegrafInlineMenu from 'telegraf-inline-menu'

import {Session, Persist} from '../lib/types'
import {Shop} from '../lib/types/shop'
import {TalentName, TALENTS} from '../lib/types/people'

import {emojis} from '../lib/interface/emojis'
import {humanReadableTimestamp} from '../lib/interface/formatted-time'
import {infoHeader} from '../lib/interface/formatted-strings'
import {menuPhoto, buttonText} from '../lib/interface/menu'
import {personInShopLine} from '../lib/interface/person'

function employeeEntry(ctx: any, shop: Shop, talent: TalentName): string {
	const {__wikibase_language_code: locale} = ctx.session as Session
	const person = shop.personal[talent]

	let text = ''
	text += '  '
	text += emojis[talent]

	if (!person) {
		text += emojis.noPerson
		return text
	}

	text += personInShopLine(shop, talent)

	if (person.hobby !== shop.id) {
		text += '\n'
		text += '    '
		text += emojis.hobby
		text += ctx.wd.r(person.hobby).label()
	}

	text += '\n'
	text += '    '
	text += emojis.retirement
	text += humanReadableTimestamp(person.retirementTimestamp, locale)

	return text
}

function shopEntry(ctx: any, shop: Shop): string {
	const employeeEntries = TALENTS
		.map(t => employeeEntry(ctx, shop, t))

	let text = ''
	text += emojis.shop
	text += '*'
	text += ctx.wd.r(shop.id).label()
	text += '*'
	text += '\n'

	text += employeeEntries
		.join('\n')

	return text
}

function menuText(ctx: any): string {
	const persist = ctx.persist as Persist

	let text = ''
	text += infoHeader(ctx.wd.r('menu.employee'), {titlePrefix: emojis.person})
	text += '\n\n'

	text += persist.shops
		.map(o => shopEntry(ctx, o))
		.join('\n\n')

	return text
}

const menu = new TelegrafInlineMenu(menuText, {
	photo: menuPhoto('menu.employee')
})

menu.urlButton(
	buttonText(emojis.wikidataItem, 'menu.wikidataItem'),
	(ctx: any) => ctx.wd.r('menu.employee').url()
)

export default menu
