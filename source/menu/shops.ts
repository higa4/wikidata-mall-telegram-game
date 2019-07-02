import TelegrafInlineMenu from 'telegraf-inline-menu'

import {Session} from '../lib/types'
import {Shop} from '../lib/types/shop'

import {randomUnusedEntry} from '../lib/js-helper/array'

import * as wdShops from '../lib/wikidata/shops'

import {buildCost} from '../lib/math/shop'

import {buttonText, menuPhoto} from '../lib/interface/menu'
import {infoHeader, labeledFloat} from '../lib/interface/formatted-strings'
import emoji from '../lib/interface/emojis'

import shopMenu from './shop'

function buildCostFromCtx(ctx: any): number {
	return buildCost(userShops(ctx).length)
}

function menuText(ctx: any): string {
	const session = ctx.session as Session

	let text = ''
	text += infoHeader(ctx.wd.r('menu.shop'))
	text += '\n\n'

	text += labeledFloat(ctx.wd.r('other.money'), session.money, emoji.currency)
	text += '\n\n'

	const cost = buildCostFromCtx(ctx)

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
	const session = ctx.session as Session
	return session.shops.map(o => o.id)
}

menu.selectSubmenu('shop', userShops, shopMenu, {
	columns: 2,
	textFunc: (ctx: any, key) => ctx.wd.r(key).label()
})

menu.button(buttonText(emoji.construction, 'action.construction'), 'build', {
	hide: (ctx: any) => buildCostFromCtx(ctx) > ctx.session.money,
	doFunc: (ctx: any) => {
		const session = ctx.session as Session
		const cost = buildCost(session.shops.length)

		if (session.money < cost) {
			// Fishy
			return
		}

		const newShopId = randomUnusedEntry(wdShops.allShops(), userShops(ctx))
		const newShop: Shop = {
			id: newShopId,
			products: []
		}

		session.money -= cost
		session.shops.push(newShop)
	}
})

export default menu
