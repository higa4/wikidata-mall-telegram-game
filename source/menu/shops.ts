import TelegrafInlineMenu from 'telegraf-inline-menu'

import {Session, Persist} from '../lib/types'

import {costForAdditionalShop} from '../lib/game-math/shop'

import {buttonText, menuPhoto} from '../lib/interface/menu'
import {emojis} from '../lib/interface/emojis'
import {infoHeader, labeledFloat} from '../lib/interface/formatted-strings'

import constructionMenu from './shops-construction'
import shopMenu from './shop'

function menuText(ctx: any): string {
	const session = ctx.session as Session
	const persist = ctx.persist as Persist

	let text = ''
	text += infoHeader(ctx.wd.r('menu.shop'), {
		titlePrefix: emojis.shop,
		titleSuffix: `(${persist.shops.length})`
	})
	text += '\n\n'

	text += labeledFloat(ctx.wd.r('other.money'), session.money, emojis.currency)
	text += '\n\n'

	const cost = costForAdditionalShop(persist.shops.length)

	text += emojis.construction
	text += '*'
	text += ctx.wd.r('action.construction').label()
	text += '*'
	text += '\n'
	text += labeledFloat(ctx.wd.r('other.cost'), cost, emojis.currency)

	return text
}

const menu = new TelegrafInlineMenu(menuText, {
	photo: menuPhoto('menu.shop')
})

function userShops(ctx: any): string[] {
	const persist = ctx.persist as Persist
	return persist.shops.map(o => o.id)
}

menu.selectSubmenu('s', userShops, shopMenu, {
	columns: 2,
	textFunc: (ctx: any, key) => ctx.wd.r(key).label()
})

menu.submenu(buttonText(emojis.construction, 'action.construction'), 'build', constructionMenu, {
	hide: (ctx: any) => {
		const session = ctx.session as Session
		const persist = ctx.persist as Persist
		const cost = costForAdditionalShop(persist.shops.length)
		return cost > session.money
	}
})

menu.urlButton(
	buttonText(emojis.wikidataItem, 'menu.wikidataItem'),
	(ctx: any) => ctx.wd.r('menu.shop').url()
)

export default menu

export const replyMenu = menu.replyMenuMiddleware()
