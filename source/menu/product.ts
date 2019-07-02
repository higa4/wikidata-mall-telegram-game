import TelegrafInlineMenu from 'telegraf-inline-menu'
import WikidataEntityReader from 'wikidata-entity-reader'

import {Session} from '../lib/types'
import {Shop, Product} from '../lib/types/shop'

import {infoHeader, labeledNumber} from '../lib/interface/formatted-strings'
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

function menuText(ctx: any): string {
	const {product} = fromCtx(ctx)
	const reader = ctx.wd.r(product.id) as WikidataEntityReader

	console.log('product', product)

	let text = ''
	text += infoHeader(reader)
	text += '\n\n'

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
