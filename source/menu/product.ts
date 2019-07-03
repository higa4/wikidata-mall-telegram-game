import TelegrafInlineMenu from 'telegraf-inline-menu'
import WikidataEntityReader from 'wikidata-entity-reader'

import {Session} from '../lib/types'
import {Shop, Product} from '../lib/types/shop'
import {TalentName} from '../lib/types/people'

import {storageCapacity, personalBonus, sellingCost, purchasingCost} from '../lib/math/product'

import {infoHeader, bonusPercentString, labeledInt, labeledFloat} from '../lib/interface/formatted-strings'
import {menuPhoto, buttonText} from '../lib/interface/menu'
import emoji from '../lib/interface/emojis'

import employeeMenu from './product-employees'

function fromCtx(ctx: any): {shop: Shop; product: Product} {
	const shopType = ctx.match[1]
	const productId = ctx.match[2]
	const session = ctx.session as Session
	const shop = session.shops.filter(o => o.id === shopType)[0]
	const product = shop.products.filter(o => o.id === productId)[0]
	return {shop, product}
}

function bonusPerson(shop: Shop, product: Product, talent: TalentName): string {
	const person = product.personal[talent]
	if (!person) {
		return ''
	}

	const {name, hobby} = person
	const namePart = `*${name.given}* ${name.family}`
	const isHobby = hobby === shop.id
	const bonus = personalBonus(shop, product, talent)

	return `\n  ${bonusPercentString(bonus)} ${isHobby ? emoji.hobby + ' ' : ''}${namePart}`
}

function menuText(ctx: any): string {
	const {product, shop} = fromCtx(ctx)
	const reader = ctx.wd.r(product.id) as WikidataEntityReader

	const capacity = storageCapacity(shop, product)
	const freeCapacity = capacity - product.itemsInStore
	const purchaseCostPerItem = purchasingCost(shop, product)
	const sellingCostPerItem = sellingCost(shop, product)

	let text = ''
	text += infoHeader(reader)
	text += '\n\n'

	text += emoji.storage
	text += labeledInt(ctx.wd.r('product.storage'), product.itemsInStore)
	text += '\n'
	text += labeledInt(ctx.wd.r('product.storageCapacity'), capacity)
	text += bonusPerson(shop, product, 'storage')
	text += '\n'

	text += '\n'
	text += '*'
	text += ctx.wd.r('other.cost').label()
	text += '*'
	text += ' / 1'
	text += '\n'

	text += emoji.purchasing
	text += labeledFloat(ctx.wd.r('person.talents.purchasing'), purchaseCostPerItem, emoji.currency)
	text += bonusPerson(shop, product, 'purchasing')
	text += '\n'

	text += emoji.selling
	text += labeledFloat(ctx.wd.r('person.talents.selling'), sellingCostPerItem, emoji.currency)
	text += bonusPerson(shop, product, 'selling')
	text += '\n'

	text += emoji.income
	text += ctx.wd.r('other.income').label()
	text += ': '
	text += bonusPercentString(sellingCostPerItem / purchaseCostPerItem)
	text += '\n'

	if (freeCapacity > 0) {
		text += '\n'
		text += emoji.purchasing
		text += '*'
		text += ctx.wd.r('person.talents.purchasing').label()
		text += '*'
		text += '\n'
		text += labeledFloat(ctx.wd.r('other.cost'), purchaseCostPerItem * freeCapacity, emoji.currency)
		text += '\n'
	}

	return text
}

const menu = new TelegrafInlineMenu(menuText, {
	photo: menuPhoto(ctx => fromCtx(ctx).product.id)
})

menu.button(buttonText(emoji.purchasing, 'person.talents.purchasing'), 'fill', {
	hide: ctx => {
		const {shop, product} = fromCtx(ctx)
		const capacity = storageCapacity(shop, product)
		return product.itemsInStore >= capacity
	},
	doFunc: (ctx: any) => {
		const session = ctx.session as Session
		const now = Date.now() / 1000

		const {shop, product} = fromCtx(ctx)
		const capacity = storageCapacity(shop, product)
		const freeCapacity = capacity - product.itemsInStore

		const costPerItem = purchasingCost(shop, product)
		const moneyOfItemsAvailable = Math.floor(session.money / costPerItem)

		const buyItems = Math.min(freeCapacity, moneyOfItemsAvailable)
		if (buyItems < 1) {
			return
		}

		session.money -= buyItems * costPerItem
		product.itemsInStore += buyItems
		product.itemTimestamp = now
	}
})

menu.submenu(buttonText(emoji.person, 'menu.employee'), 'e', employeeMenu)

menu.urlButton(
	(ctx: any) => `${emoji.wikidataItem} ${ctx.wd.r('menu.wikidataItem').label()}`,
	(ctx: any) => ctx.wd.r(fromCtx(ctx).product.id).url()
)

export default menu
