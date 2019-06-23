import TelegrafInlineMenu from 'telegraf-inline-menu'
import WikidataEntityReader from 'wikidata-entity-reader'

import {Shop, Product} from '../lib/types/shop'

import {randomUnusedEntry} from '../lib/js-helper/array'

import * as wdShop from '../lib/wikidata/shops'

import {buttonText} from '../lib/interface/button'
import {infoHeader} from '../lib/interface/info-header'
import emoji from '../lib/interface/emojis'

import productMenu from './product'

function fromCtx(ctx: any): {shopType: string; shop: Shop} {
	const shopType = ctx.match[1]
	const shop: Shop = ctx.session.shops[shopType]
	return {shopType, shop}
}

function menuText(ctx: any): string {
	const {shopType} = fromCtx(ctx)
	const reader = ctx.wd.r(shopType) as WikidataEntityReader

	const products = wdShop.products(shopType) || []

	let text = ''
	text += infoHeader(reader)
	text += '\n\n'

	text += products
		.slice(0, 20)
		.map(o => ctx.wd.r(o).label())
		.map(o => `- ${o}`)
		.join('\n')

	return text
}

const menu = new TelegrafInlineMenu(menuText, {
	photo: (ctx: any) => ctx.wd.r(fromCtx(ctx).shopType).images(800)[0]
})

function userProducts(ctx: any): string[] {
	const {shop} = fromCtx(ctx)
	return Object.keys(shop.products)
}

menu.selectSubmenu('product', userProducts, productMenu, {
	columns: 2,
	textFunc: (ctx: any, key) => ctx.wd.r(key).label()
})

menu.button(buttonText(emoji.add, 'other.assortment'), 'addProduct', {
	hide: ctx => userProducts(ctx).length >= 5,
	doFunc: ctx => {
		const {shopType, shop} = fromCtx(ctx)

		const pickedProductId = randomUnusedEntry(
			wdShop.products(shopType) || [],
			userProducts(ctx)
		)

		const pickedProduct: Product = {}

		shop.products[pickedProductId] = pickedProduct
	}
})

menu.button(buttonText(emoji.close, 'action.close'), 'remove', {
	setParentMenuAfter: true,
	doFunc: (ctx: any) => {
		const {shopType} = fromCtx(ctx)
		delete ctx.session.shops[shopType]
	}
})

menu.urlButton(
	(ctx: any) => `${emoji.wikidataItem} ${ctx.wd.r('menu.wikidataItem').label()}`,
	(ctx: any) => ctx.wd.r(fromCtx(ctx).shopType).url()
)

export default menu
