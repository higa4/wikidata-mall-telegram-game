import TelegrafInlineMenu from 'telegraf-inline-menu'

import {Session} from '../lib/types'
import {Shop, Product} from '../lib/types/shop'
import {TalentName, Person} from '../lib/types/people'

import {buttonText} from '../lib/interface/menu'
import {infoHeader} from '../lib/interface/formatted-strings'
import {personMarkdown} from '../lib/interface/person'
import emojis from '../lib/interface/emojis'

function fromCtx(ctx: any): {shop: Shop; product: Product; talent: TalentName; person?: Person} {
	const shopType = ctx.match[1]
	const productId = ctx.match[2]
	const talent = ctx.match[3] as TalentName

	const session = ctx.session as Session
	const shop = session.shops.filter(o => o.id === shopType)[0]
	const product = shop.products.filter(o => o.id === productId)[0]
	const person = product.personal[talent]

	return {shop, product, talent, person}
}

function menuText(ctx: any): string {
	const {talent, person} = fromCtx(ctx)

	let text = ''
	text += infoHeader(ctx.wd.r(`person.talents.${talent}`))
	text += '\n\n'

	if (person) {
		text += personMarkdown(ctx, person)
	} else {
		text += emojis.noPerson
	}

	return text
}

const menu = new TelegrafInlineMenu(menuText)

menu.button(buttonText(emojis.employmentTermination, 'action.employmentTermination'), 'remove', {
	hide: ctx => !fromCtx(ctx).person,
	doFunc: (ctx: any) => {
		const {product, talent} = fromCtx(ctx)
		delete product.personal[talent]
	}
})

// TODO: select employee from applicants

export default menu
