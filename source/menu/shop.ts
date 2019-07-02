import TelegrafInlineMenu from 'telegraf-inline-menu'
import WikidataEntityReader from 'wikidata-entity-reader'

import {Shop, Product} from '../lib/types/shop'
import {Session} from '../lib/types'

import {randomUnusedEntry} from '../lib/js-helper/array'

import {buildCost, productCost} from '../lib/math/shop'

import * as wdShop from '../lib/wikidata/shops'

import {buttonText, menuPhoto} from '../lib/interface/menu'
import {infoHeader, labeledNumber} from '../lib/interface/formatted-strings'
import emoji from '../lib/interface/emojis'

import productMenu from './product'

function fromCtx(ctx: any): Shop {
	const session = ctx.session as Session
	const shopType = ctx.match[1]
	return session.shops.filter(o => o.id === shopType)[0]
}

function addProductCostFromCtx(ctx: any): number {
	return addProductCostFromSession(ctx.session, fromCtx(ctx))
}

function addProductCostFromSession(session: Session, shop: Shop): number {
	return productCost(session.shops.length, shop.products.length)
}

function menuText(ctx: any): string {
	const shop = fromCtx(ctx)
	const reader = ctx.wd.r(shop.id) as WikidataEntityReader

	const session = ctx.session as Session

	let text = ''
	text += infoHeader(reader)
	text += '\n\n'

	text += labeledNumber(ctx.wd.r('other.money'), session.money, emoji.currency)
	text += '\n\n'

	const cost = addProductCostFromSession(session, shop)
	if (userProducts(ctx).length < 5) {
		text += emoji.add
		text += '*'
		text += ctx.wd.r('other.assortment').label()
		text += '*'
		text += '\n'
		text += labeledNumber(ctx.wd.r('other.cost'), cost, emoji.currency)
	}

	return text
}

const menu = new TelegrafInlineMenu(menuText, {
	photo: menuPhoto(ctx => fromCtx(ctx).id)
})

function userProducts(ctx: any): string[] {
	const shop = fromCtx(ctx)
	return shop.products.map(o => o.id)
}

menu.selectSubmenu('product', userProducts, productMenu, {
	columns: 2,
	textFunc: (ctx: any, key) => ctx.wd.r(key).label()
})

menu.button(buttonText(emoji.add, 'other.assortment'), 'addProduct', {
	hide: (ctx: any) => userProducts(ctx).length >= 5 || addProductCostFromCtx(ctx) > ctx.session.money,
	doFunc: (ctx: any) => {
		const shop = fromCtx(ctx)
		const session = ctx.session as Session
		const now = Math.floor(Date.now() / 1000)

		const cost = addProductCostFromSession(session, shop)
		if (session.money < cost) {
			// Fishy
			return
		}

		const pickedProductId = randomUnusedEntry(
			wdShop.products(shop.id) || [],
			userProducts(ctx)
		)

		const pickedProduct: Product = {
			id: pickedProductId,
			personal: {}
		}

		session.money -= cost
		shop.products.push(pickedProduct)
	}
})

menu.button(buttonText(emoji.close, 'action.close'), 'remove', {
	setParentMenuAfter: true,
	doFunc: (ctx: any) => {
		const shop = fromCtx(ctx)
		const session = ctx.session as Session

		session.shops = session.shops.filter(o => o.id !== shop.id)

		const existingShops = session.shops.length
		ctx.session.money += Math.ceil(buildCost(existingShops) / 2)
	}
})

menu.urlButton(
	(ctx: any) => `${emoji.wikidataItem} ${ctx.wd.r('menu.wikidataItem').label()}`,
	(ctx: any) => ctx.wd.r(fromCtx(ctx).id).url()
)

export default menu
