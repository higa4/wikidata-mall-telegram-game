import TelegrafInlineMenu from 'telegraf-inline-menu'
import WikidataEntityReader from 'wikidata-entity-reader'

import {Session, Persist} from '../lib/types'
import {Shop} from '../lib/types/shop'

import {moneyForShopClosure} from '../lib/game-math/shop'

import * as wdShop from '../lib/wikidata/shops'

import {buttonText, menuPhoto} from '../lib/interface/menu'
import {formatFloat, formatInt} from '../lib/interface/format-number'
import {infoHeader, labeledFloat} from '../lib/interface/formatted-strings'
import emojis from '../lib/interface/emojis'

import {replyMenu} from './shops'

function fromCtx(ctx: any): {shop: Shop; indexOfShop: number} {
	const persist = ctx.persist as Persist
	const shopType = ctx.match[1]
	const indexOfShop = persist.shops.map(o => o.id).indexOf(shopType)
	const shop = persist.shops[indexOfShop]
	return {shop, indexOfShop}
}

function menuText(ctx: any): string {
	const {shop} = fromCtx(ctx)
	const reader = ctx.wd.r('action.close') as WikidataEntityReader

	const session = ctx.session as Session
	const persist = ctx.persist as Persist

	const shopBuildable = wdShop.allShops().includes(shop.id)
	const closureMoney = moneyForShopClosure(persist.shops.length, shop.products.length, shopBuildable)

	let text = ''
	text += infoHeader(reader, {titlePrefix: emojis.close})
	text += '\n\n'

	text += labeledFloat(ctx.wd.r('other.money'), session.money, emojis.currency)
	text += '\n\n'

	text += emojis.close
	text += '*'
	text += ctx.wd.r(shop.id).label()
	text += '*'
	text += '\n'
	text += '+'
	text += formatFloat(closureMoney)
	text += emojis.currency
	text += '\n\n'

	const itemsInStore = shop.products.map(o => o.itemsInStore).reduce((a, b) => a + b, 0)
	if (itemsInStore) {
		text += emojis.warning
		text += formatInt(itemsInStore)
		text += emojis.storage
	}

	return text
}

const menu = new TelegrafInlineMenu(menuText, {
	photo: menuPhoto(ctx => fromCtx(ctx).shop.id)
})

menu.simpleButton(buttonText(emojis.yes + emojis.close, 'action.close'), 'remove', {
	doFunc: async (ctx: any) => {
		const {shop} = fromCtx(ctx)
		const session = ctx.session as Session
		const persist = ctx.persist as Persist

		const isBuildable = wdShop.allShops().includes(shop.id)
		const reward = moneyForShopClosure(persist.shops.length, shop.products.length, isBuildable)

		persist.shops = persist.shops.filter(o => o.id !== shop.id)
		session.money += reward

		await replyMenu.middleware()(ctx, undefined)
	}
})

menu.urlButton(
	buttonText(emojis.wikidataItem, 'menu.wikidataItem'),
	(ctx: any) => ctx.wd.r('action.close').url()
)

export default menu
