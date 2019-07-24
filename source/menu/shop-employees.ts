import TelegrafInlineMenu from 'telegraf-inline-menu'

import {Session} from '../lib/types'
import {Shop} from '../lib/types/shop'
import {TALENTS, TalentName} from '../lib/types/people'

import {buttonText} from '../lib/interface/menu'
import {infoHeader} from '../lib/interface/formatted-strings'
import {personInShopLine} from '../lib/interface/person'
import emojis from '../lib/interface/emojis'

import employee from './shop-employee'

function fromCtx(ctx: any): {shop: Shop} {
	const shopType = ctx.match[1]
	const session = ctx.session as Session
	const shop = session.shops.filter(o => o.id === shopType)[0]
	return {shop}
}

function talentLine(ctx: any, shop: Shop, talent: TalentName): string {
	const person = shop.personal[talent]

	let text = ''
	text += emojis[talent]
	text += '*'
	text += ctx.wd.r(`person.talents.${talent}`).label()
	text += '*'
	text += '\n  '

	if (person) {
		text += personInShopLine(shop, talent)
	} else {
		text += emojis.noPerson
	}

	return text
}

function menuText(ctx: any): string {
	const {shop} = fromCtx(ctx)
	let text = ''
	text += infoHeader(ctx.wd.r('menu.employee'))
	text += '\n\n'

	text +=	TALENTS
		.map(o => talentLine(ctx, shop, o))
		.join('\n')

	return text
}

const menu = new TelegrafInlineMenu(menuText)

menu.selectSubmenu('t', TALENTS, employee, {
	columns: 1,
	textFunc: buttonText((_ctx, key) => emojis[key!], (_ctx, key) => `person.talents.${key}`)
})

export default menu
