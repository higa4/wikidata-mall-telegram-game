import TelegrafInlineMenu from 'telegraf-inline-menu'
import WikidataEntityReader from 'wikidata-entity-reader'

import {Session} from '../lib/types'
import {Shop, Product} from '../lib/types/shop'
import {TalentName} from '../lib/types/people'

import {storageCapacity, personalBonus, sellingCost, purchasingCost} from '../lib/math/product'

import {infoHeader, bonusPercentString, labeledInt, labeledFloat} from '../lib/interface/formatted-strings'
import {menuPhoto} from '../lib/interface/menu'
import emoji from '../lib/interface/emojis'

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

	console.log('product', product)

	let text = ''
	text += infoHeader(reader)
	text += '\n\n'

	text += emoji.storage
	text += labeledInt(ctx.wd.r('product.storage'), product.itemsInStore)
	text += '\n'
	text += labeledInt(ctx.wd.r('product.storageCapacity'), storageCapacity(shop, product))
	text += bonusPerson(shop, product, 'storage')
	text += '\n'

	text += '\n'
	text += '*'
	text += ctx.wd.r('other.cost').label()
	text += '*'
	text += ' / 1'
	text += '\n'

	text += emoji.purchasing
	text += labeledFloat(ctx.wd.r('person.talents.purchasing'), purchasingCost(shop, product), emoji.currency)
	text += bonusPerson(shop, product, 'purchasing')
	text += '\n'

	text += emoji.selling
	text += labeledFloat(ctx.wd.r('person.talents.selling'), sellingCost(shop, product), emoji.currency)
	text += bonusPerson(shop, product, 'selling')
	text += '\n'

	text += emoji.income
	text += ctx.wd.r('other.income').label()
	text += ': '
	text += bonusPercentString(sellingCost(shop, product) / purchasingCost(shop, product))
	text += '\n'

	return text
}

const menu = new TelegrafInlineMenu(menuText, {
	photo: menuPhoto(ctx => fromCtx(ctx).product.id)
})

menu.urlButton(
	(ctx: any) => `${emoji.wikidataItem} ${ctx.wd.r('menu.wikidataItem').label()}`,
	(ctx: any) => ctx.wd.r(fromCtx(ctx).product.id).url()
)

export default menu
