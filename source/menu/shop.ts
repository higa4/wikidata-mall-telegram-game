import TelegrafInlineMenu from 'telegraf-inline-menu'
import WikidataEntityReader from 'wikidata-entity-reader'

import {Session, Persist} from '../lib/types'
import {Shop, Product} from '../lib/types/shop'
import {TalentName} from '../lib/types/people'

import {randomUnusedEntry} from '../lib/js-helper/array'

import {buildCost, productCost, storageCapacity} from '../lib/math/shop'
import {incomeFactor} from '../lib/math/personal'

import * as wdShop from '../lib/wikidata/shops'

import {buttonText, menuPhoto} from '../lib/interface/menu'
import {infoHeader, labeledFloat, labeledInt, bonusPercentString} from '../lib/interface/formatted-strings'
import {personInShopLine} from '../lib/interface/person'
import emoji from '../lib/interface/emojis'

import employeeMenu from './shop-employees'
import productMenu from './product'

const POSSIBLE_PRODUCTS = 6

function fromCtx(ctx: any): Shop {
	const persist = ctx.persist as Persist
	const shopType = ctx.match[1]
	return persist.shops.filter(o => o.id === shopType)[0]
}

function addProductCostFromCtx(ctx: any): number {
	return addProductCost(ctx.persist.shops, fromCtx(ctx))
}

function addProductCost(shops: Shop[], shop: Shop): number {
	return productCost(shops.length, shop.products.length)
}

function productLine(ctx: any, product: Product): string {
	let text = ''
	text += labeledInt(ctx.wd.r(product.id), product.itemsInStore, emoji.storage)

	return text
}

function bonusPerson(ctx: any, shop: Shop, talent: TalentName): string {
	const person = shop.personal[talent]
	if (!person) {
		return ''
	}

	let text = ''
	text += emoji[talent]
	text += '*'
	text += ctx.wd.r(`person.talents.${talent}`).label()
	text += '*'
	text += '\n'
	text += '  '
	text += personInShopLine(shop, talent)
	text += '\n'

	return text
}

function storageCapacityPart(ctx: any, shop: Shop): string {
	let text = ''
	text += emoji.storage
	text += labeledInt(ctx.wd.r('product.storageCapacity'), storageCapacity(shop))
	if (shop.personal.storage) {
		text += '\n'
		text += '  '
		text += personInShopLine(shop, 'storage')
	}

	text += '\n\n'
	return text
}

function productsPart(ctx: any, shop: Shop): string {
	if (shop.products.length === 0) {
		return ''
	}

	let text = ''
	text += '*'
	text += ctx.wd.r('other.assortment').label()
	text += '*'
	text += '\n'

	text += shop.products
		.map(product => productLine(ctx, product))
		.map(o => `  ${o}`)
		.join('\n')
	text += '\n\n'
	return text
}

function addProductPart(ctx: any, shop: Shop): string {
	const persist = ctx.persist as Persist

	if (shop.products.length >= POSSIBLE_PRODUCTS) {
		return ''
	}

	const cost = addProductCost(persist.shops, shop)

	let text = ''
	text += emoji.add
	text += '*'
	text += ctx.wd.r('other.assortment').label()
	text += '*'
	text += '\n'
	text += '  '
	text += labeledFloat(ctx.wd.r('other.cost'), cost, emoji.currency)
	text += '\n\n'
	return text
}

function incomePart(ctx: any, shop: Shop): string {
	let text = ''
	text += bonusPerson(ctx, shop, 'purchasing')
	text += bonusPerson(ctx, shop, 'selling')

	text += emoji.income
	text += ctx.wd.r('other.income').label()
	text += ': '
	text += bonusPercentString(incomeFactor(shop))
	text += '\n\n'
	return text
}

function menuText(ctx: any): string {
	const shop = fromCtx(ctx)
	const reader = ctx.wd.r(shop.id) as WikidataEntityReader

	const session = ctx.session as Session

	let text = ''
	text += infoHeader(reader)
	text += '\n\n'

	text += labeledFloat(ctx.wd.r('other.money'), session.money, emoji.currency)
	text += '\n\n'

	text += storageCapacityPart(ctx, shop)
	text += productsPart(ctx, shop)
	text += addProductPart(ctx, shop)
	text += incomePart(ctx, shop)

	return text
}

const menu = new TelegrafInlineMenu(menuText, {
	photo: menuPhoto(ctx => fromCtx(ctx).id)
})

function userProducts(ctx: any): string[] {
	const shop = fromCtx(ctx)
	return shop.products.map(o => o.id)
}

menu.selectSubmenu('p', userProducts, productMenu, {
	columns: 2,
	textFunc: (ctx: any, key) => ctx.wd.r(key).label()
})

menu.button(buttonText(emoji.add, 'other.assortment'), 'addProduct', {
	hide: (ctx: any) => {
		if (userProducts(ctx).length >= POSSIBLE_PRODUCTS) {
			return true
		}

		const session = ctx.session as Session
		return addProductCostFromCtx(ctx) > session.money
	},
	doFunc: (ctx: any) => {
		const shop = fromCtx(ctx)
		const session = ctx.session as Session
		const persist = ctx.persist as Persist
		const now = Math.floor(Date.now() / 1000)

		const cost = addProductCost(persist.shops, shop)
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
			itemsInStore: 0,
			itemTimestamp: now
		}

		session.money -= cost
		shop.products.push(pickedProduct)
	}
})

menu.submenu(buttonText(emoji.person, 'menu.employee'), 'e', employeeMenu)

menu.button(buttonText(emoji.close, 'action.close'), 'remove', {
	setParentMenuAfter: true,
	hide: (ctx: any) => {
		const persist = ctx.persist as Persist
		return persist.shops.length <= 1
	},
	doFunc: (ctx: any) => {
		const shop = fromCtx(ctx)
		const session = ctx.session as Session
		const persist = ctx.persist as Persist

		persist.shops = persist.shops.filter(o => o.id !== shop.id)

		const existingShops = persist.shops.length
		session.money += Math.ceil(buildCost(existingShops) / 2)
	}
})

menu.urlButton(
	(ctx: any) => `${emoji.wikidataItem} ${ctx.wd.r('menu.wikidataItem').label()}`,
	(ctx: any) => ctx.wd.r(fromCtx(ctx).id).url()
)

export default menu
