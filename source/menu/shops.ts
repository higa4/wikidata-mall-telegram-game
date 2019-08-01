import TelegrafInlineMenu from 'telegraf-inline-menu'

import {Session, Persist} from '../lib/types'
import {Shop} from '../lib/types/shop'

import {randomUnusedEntry} from '../lib/js-helper/array'

import * as wdShops from '../lib/wikidata/shops'

import {costForAdditionalShop} from '../lib/game-math/shop'

import {buttonText, menuPhoto} from '../lib/interface/menu'
import {infoHeader, labeledFloat} from '../lib/interface/formatted-strings'
import emoji from '../lib/interface/emojis'

import shopMenu from './shop'

function menuText(ctx: any): string {
	const session = ctx.session as Session
	const persist = ctx.persist as Persist

	let text = ''
	text += infoHeader(ctx.wd.r('menu.shop'))
	text += '\n\n'

	text += labeledFloat(ctx.wd.r('other.money'), session.money, emoji.currency)
	text += '\n\n'

	const cost = costForAdditionalShop(persist.shops.length)

	text += emoji.construction
	text += '*'
	text += ctx.wd.r('action.construction').label()
	text += '*'
	text += '\n'
	text += labeledFloat(ctx.wd.r('other.cost'), cost, emoji.currency)

	return text
}

const menu = new TelegrafInlineMenu(menuText, {
	photo: menuPhoto('menu.shop')
})

function userShops(ctx: any): string[] {
	const persist = ctx.persist as Persist
	return persist.shops.map(o => o.id)
}

menu.selectSubmenu('s', userShops, shopMenu, {
	columns: 2,
	textFunc: (ctx: any, key) => ctx.wd.r(key).label()
})

menu.button(buttonText(emoji.construction, 'action.construction'), 'build', {
	hide: (ctx: any) => {
		const session = ctx.session as Session
		const persist = ctx.persist as Persist
		const cost = costForAdditionalShop(persist.shops.length)
		return cost > session.money
	},
	doFunc: (ctx: any) => {
		const session = ctx.session as Session
		const persist = ctx.persist as Persist
		const cost = costForAdditionalShop(persist.shops.length)

		if (session.money < cost) {
			// Fishy
			return
		}

		const newShopId = randomUnusedEntry(wdShops.allShops(), userShops(ctx))
		const newShop: Shop = {
			id: newShopId,
			personal: {},
			products: []
		}

		session.money -= cost
		persist.shops.push(newShop)
	}
})

menu.urlButton(
	buttonText(emoji.wikidataItem, 'menu.wikidataItem'),
	(ctx: any) => ctx.wd.r('menu.shop').url()
)

export default menu
