import TelegrafInlineMenu from 'telegraf-inline-menu'
import WikidataEntityReader from 'wikidata-entity-reader'

import {Session, Persist} from '../lib/types'
import {Shop, Product} from '../lib/types/shop'
import {Skills} from '../lib/types/skills'

import {randomUnusedEntry} from '../lib/js-helper/array'

import {addProductToShopCost, storageCapacity, shopDiversificationFactor, customerInterval, moneyForShopClosure, buyAllCost, buyAllCostFactor, storageCapactiyPressBonus, shopProductsPossible} from '../lib/game-math/shop'
import {currentLevel} from '../lib/game-math/skill'

import * as wdShop from '../lib/wikidata/shops'

import {buttonText, menuPhoto} from '../lib/interface/menu'
import {formatInt} from '../lib/interface/format-number'
import {humanReadableTimestamp} from '../lib/interface/formatted-time'
import {infoHeader, labeledFloat, labeledInt} from '../lib/interface/formatted-strings'
import {percentBonusString} from '../lib/interface/format-percent'
import {personInShopLine} from '../lib/interface/person'
import emoji from '../lib/interface/emojis'

import employeeMenu from './shop-employees'
import productMenu from './product'

function fromCtx(ctx: any): {shop: Shop; indexOfShop: number} {
	const persist = ctx.persist as Persist
	const shopType = ctx.match[1]
	const indexOfShop = persist.shops.map(o => o.id).indexOf(shopType)
	const shop = persist.shops[indexOfShop]
	return {shop, indexOfShop}
}

function canAddProductTechnically(shop: Shop, skills: Skills): boolean {
	const logisticsLevel = currentLevel(skills, 'logistics', shop.id)
	const possibleProducts = shopProductsPossible(logisticsLevel)

	const currentProductsAmount = shop.products.length
	if (currentProductsAmount >= possibleProducts) {
		return false
	}

	const allAvailableProductsForShop = (wdShop.products(shop.id) || []).length
	const productsAvailable = allAvailableProductsForShop - currentProductsAmount
	if (productsAvailable <= 0) {
		return false
	}

	return true
}

function productLine(ctx: any, product: Product): string {
	let text = ''
	text += labeledInt(ctx.wd.r(product.id), product.itemsInStore, emoji.storage)

	return text
}

function openingPart(ctx: any, shop: Shop): string {
	const {__wikibase_language_code: locale} = ctx.session as Session

	let text = ''
	text += emoji.opening
	text += ctx.wd.r('shop.opening').label()
	text += '\n'
	text += '  '
	text += humanReadableTimestamp(shop.opening, locale)
	text += '\n\n'

	return text
}

function storageCapacityPart(ctx: any, shop: Shop, skills: Skills): string {
	let text = ''
	text += emoji.storage
	text += labeledInt(ctx.wd.r('product.storageCapacity'), storageCapacity(shop, skills))
	if (shop.personal.storage) {
		text += '\n'
		text += '  '
		text += emoji.person
		text += personInShopLine(shop, 'storage')
	}

	const pressLevel = currentLevel(skills, 'machinePress', shop.id)
	const pressBonus = storageCapactiyPressBonus(pressLevel)
	if (pressBonus !== 1) {
		text += '\n'
		text += '  '
		text += emoji.skill
		text += percentBonusString(pressBonus)
		text += ' '
		text += ctx.wd.r('skill.machinePress').label()
		text += ' ('
		text += pressLevel
		text += ')'
	}

	text += '\n\n'
	return text
}

function productsPart(ctx: any, shop: Shop, skills: Skills): string {
	if (shop.products.length === 0) {
		return ''
	}

	const logisticsLevel = currentLevel(skills, 'logistics', shop.id)
	const productsPossible = shopProductsPossible(logisticsLevel)
	const allAvailableProductsForShop = (wdShop.products(shop.id) || []).length

	let text = ''
	text += '*'
	text += ctx.wd.r('other.assortment').label()
	text += '*'
	text += ' ('
	text += shop.products.length
	text += ' / '
	text += Math.min(productsPossible, allAvailableProductsForShop)
	text += ')'
	text += '\n'

	if (logisticsLevel > 0) {
		text += '  '
		text += emoji.skill
		text += '+'
		text += logisticsLevel
		text += ' '
		text += ctx.wd.r('skill.logistics').label()
		text += ' ('
		text += logisticsLevel
		text += ')'
		text += '\n'
	}

	text += shop.products
		.map(product => productLine(ctx, product))
		.join('\n')
	text += '\n\n'
	return text
}

function addProductPart(ctx: any, shop: Shop): string {
	const persist = ctx.persist as Persist

	if (!canAddProductTechnically(shop, persist.skills)) {
		return ''
	}

	const indexOfShop = persist.shops.map(o => o.id).indexOf(shop.id)
	const cost = addProductToShopCost(indexOfShop, shop.products.length)

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

function customerIntervalPart(ctx: any, shop: Shop): string {
	if (shop.products.length === 0) {
		return ''
	}

	let text = ''
	text += '1 '
	text += ctx.wd.r('other.customer').label()
	text += ' / '
	text += formatInt(customerInterval(shop))
	text += ' '
	text += ctx.wd.r('unit.second').label()
	if (shop.products.length > 1) {
		text += ' / '
		text += ctx.wd.r('product.product').label()
	}

	text += '\n'
	text += '  '
	text += ctx.wd.r('product.diversification').label()
	text += ': '
	text += percentBonusString(shopDiversificationFactor(shop))

	text += '\n\n'
	return text
}

function menuText(ctx: any): string {
	const {shop} = fromCtx(ctx)
	const reader = ctx.wd.r(shop.id) as WikidataEntityReader

	const session = ctx.session as Session
	const persist = ctx.persist as Persist

	let text = ''
	text += infoHeader(reader, {titlePrefix: emoji.shop})
	text += '\n\n'

	text += labeledFloat(ctx.wd.r('other.money'), session.money, emoji.currency)
	text += '\n\n'

	text += openingPart(ctx, shop)
	text += customerIntervalPart(ctx, shop)
	text += storageCapacityPart(ctx, shop, persist.skills)
	text += productsPart(ctx, shop, persist.skills)
	text += addProductPart(ctx, shop)

	return text
}

const menu = new TelegrafInlineMenu(menuText, {
	photo: menuPhoto(ctx => fromCtx(ctx).shop.id)
})

function userProducts(ctx: any): string[] {
	const {shop} = fromCtx(ctx)
	return shop.products.map(o => o.id)
}

menu.selectSubmenu('p', userProducts, productMenu, {
	columns: 2,
	textFunc: (ctx: any, key) => ctx.wd.r(key).label()
})

menu.button(buttonText(emoji.add, 'other.assortment'), 'addProduct', {
	hide: (ctx: any) => {
		const session = ctx.session as Session
		const persist = ctx.persist as Persist
		const {shop, indexOfShop} = fromCtx(ctx)

		if (!canAddProductTechnically(shop, persist.skills)) {
			return true
		}

		return addProductToShopCost(indexOfShop, shop.products.length) > session.money
	},
	doFunc: (ctx: any) => {
		const {shop, indexOfShop} = fromCtx(ctx)
		const session = ctx.session as Session
		const now = Math.floor(Date.now() / 1000)

		const cost = addProductToShopCost(indexOfShop, shop.products.length)
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

function buyAllAdditionalCostString(ctx: any): string {
	const persist = ctx.persist as Persist
	const factor = buyAllCostFactor(persist.skills)
	return percentBonusString(factor) + emoji.currency
}

menu.button((ctx: any) => `${emoji.magnet} ${ctx.wd.r('person.talents.purchasing').label()} (${buyAllAdditionalCostString(ctx)})`, 'buy-all', {
	hide: (ctx: any) => {
		const {shop} = fromCtx(ctx)
		const session = ctx.session as Session
		const persist = ctx.persist as Persist

		const magnetismLevel = currentLevel(persist.skills, 'magnetism')

		const cost = buyAllCost(shop, persist.skills)

		return magnetismLevel === 0 || shop.products.length === 0 || session.money < cost || cost < 1
	},
	doFunc: (ctx: any) => {
		const {shop} = fromCtx(ctx)
		const session = ctx.session as Session
		const persist = ctx.persist as Persist
		const now = Math.floor(Date.now() / 1000)

		const cost = buyAllCost(shop, persist.skills)
		const storage = storageCapacity(shop, persist.skills)

		if (cost > session.money) {
			// What?
			return
		}

		for (const product of shop.products) {
			product.itemsInStore = storage
			product.itemTimestamp = now
		}

		session.money -= cost
	}
})

menu.submenu(buttonText(emoji.person, 'menu.employee'), 'e', employeeMenu)

menu.simpleButton(buttonText(emoji.close, 'action.close'), 'remove-not-possible', {
	hide: (ctx: any) => {
		const persist = ctx.persist as Persist
		const {shop} = fromCtx(ctx)
		const itemsInStore = shop.products.map(o => o.itemsInStore).reduce((a, b) => a + b, 0)
		return persist.shops.length <= 1 || itemsInStore === 0
	},
	doFunc: async ctx => ctx.answerCbQuery(emoji.warning + emoji.storage)
})

menu.button(buttonText(emoji.close, 'action.close'), 'remove', {
	setParentMenuAfter: true,
	hide: (ctx: any) => {
		const persist = ctx.persist as Persist
		const {shop} = fromCtx(ctx)
		const itemsInStore = shop.products.map(o => o.itemsInStore).reduce((a, b) => a + b, 0)
		return persist.shops.length <= 1 || itemsInStore > 0
	},
	doFunc: (ctx: any) => {
		const {shop} = fromCtx(ctx)
		const session = ctx.session as Session
		const persist = ctx.persist as Persist

		const isBuildable = wdShop.allShops().includes(shop.id)

		const reward = moneyForShopClosure(persist.shops.length, shop.products.length, isBuildable)

		persist.shops = persist.shops.filter(o => o.id !== shop.id)
		session.money += reward
	}
})

menu.urlButton(
	buttonText(emoji.wikidataItem, 'menu.wikidataItem'),
	(ctx: any) => ctx.wd.r(fromCtx(ctx).shop.id).url()
)

export default menu
