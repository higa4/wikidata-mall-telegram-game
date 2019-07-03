import TelegrafInlineMenu from 'telegraf-inline-menu'

import {Session} from '../lib/types'
import {Shop, Product} from '../lib/types/shop'
import {TALENTS, TalentName} from '../lib/types/people'

import {buttonText} from '../lib/interface/menu'
import {infoHeader} from '../lib/interface/formatted-strings'
import emojis from '../lib/interface/emojis'

import employee from './product-employee'

function fromCtx(ctx: any): {shop: Shop; product: Product} {
	const shopType = ctx.match[1]
	const productId = ctx.match[2]
	const session = ctx.session as Session
	const shop = session.shops.filter(o => o.id === shopType)[0]
	const product = shop.products.filter(o => o.id === productId)[0]
	return {shop, product}
}

function talentLine(ctx: any, shop: Shop, product: Product, talent: TalentName): string {
	const person = product.personal[talent]

	let text = ''
	text += '*'
	text += ctx.wd.r(`person.talents.${talent}`).label()
	text += '*'
	text += '\n  '

	if (person) {
		if (person.hobby === shop.id) {
			text += emojis.hobby
			text += ' '
		}

		text += `*${person.name.given}* ${person.name.family}`
	} else {
		text += emojis.noPerson
	}

	return text
}

function menuText(ctx: any): string {
	const {shop, product} = fromCtx(ctx)
	let text = ''
	text += infoHeader(ctx.wd.r('menu.employee'))
	text += '\n\n'

	text +=	TALENTS
		.map(o => talentLine(ctx, shop, product, o))
		.join('\n')

	return text
}

const menu = new TelegrafInlineMenu(menuText)

menu.selectSubmenu('t', TALENTS, employee, {
	columns: 1,
	textFunc: buttonText((_ctx, key) => emojis[key!], (_ctx, key) => `person.talents.${key}`)
})

export default menu
