import TelegrafInlineMenu from 'telegraf-inline-menu'
import WikidataEntityReader from 'wikidata-entity-reader'

import {Shop} from '../lib/types/shop'

import {infoHeader} from '../lib/interface/info-header'
import emoji from '../lib/interface/emojis'

function fromCtx(ctx: any): {shopType: string; shop: Shop; productId: string} {
	const shopType = ctx.match[1]
	const productId = ctx.match[2]
	const shop: Shop = ctx.session.shops[shopType]
	return {shopType, shop, productId}
}

function menuText(ctx: any): string {
	const {shop, productId} = fromCtx(ctx)
	const reader = ctx.wd.r(productId) as WikidataEntityReader
	const product = shop.products[productId]

	console.log('product', productId, product)

	let text = ''
	text += infoHeader(reader)
	text += '\n\n'

	return text
}

const menu = new TelegrafInlineMenu(menuText, {
	photo: (ctx: any) => ctx.wd.r(fromCtx(ctx).productId).images(800)[0]
})

menu.urlButton(
	(ctx: any) => `${emoji.wikidataItem} ${ctx.wd.r('menu.wikidataItem').label()}`,
	(ctx: any) => ctx.wd.r(fromCtx(ctx).productId).url()
)

export default menu
