import TelegrafInlineMenu from 'telegraf-inline-menu'

import {Shop} from '../lib/types/shop'

import {randomUnusedEntry} from '../lib/js-helper/array'

import * as wdShops from '../lib/wikidata/shops'

import {buttonText} from '../lib/interface/button'
import {infoHeader} from '../lib/interface/info-header'
import emoji from '../lib/interface/emojis'

import shopMenu from './shop'

const MAX_SHOPS = 10

function menuText(ctx: any): string {
	let text = ''
	text += infoHeader(ctx.wd.r('menu.shop'))
	text += '\n\n'

	text += 'content'

	return text
}

const menu = new TelegrafInlineMenu(menuText, {
	photo: (ctx: any) => ctx.wd.r('menu.shop').images(800)[0]
})

function userShops(ctx: any): string[] {
	return Object.keys(ctx.session.shops || {})
}

menu.selectSubmenu('shop', userShops, shopMenu, {
	columns: 2,
	textFunc: (ctx: any, key) => ctx.wd.r(key).label()
})

menu.button(buttonText(emoji.construction, 'action.construction'), 'build', {
	hide: ctx => userShops(ctx).length >= MAX_SHOPS,
	doFunc: (ctx: any) => {
		if (!ctx.session.shops) {
			ctx.session.shops = {}
		}

		const newShopId = randomUnusedEntry(wdShops.allShops(), userShops(ctx))
		const newShop: Shop = {
			products: {}
		}

		ctx.session.shops[newShopId] = newShop
	}
})

export default menu
