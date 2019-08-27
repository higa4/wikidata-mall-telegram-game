import TelegrafInlineMenu from 'telegraf-inline-menu'

import {Session, Persist} from '../lib/types'
import {Shop, Construction} from '../lib/types/shop'

import {randomUnusedEntry} from '../lib/js-helper/array'
import {Dictionary, sortDictByValue} from '../lib/js-helper/dictionary'

import * as wdShops from '../lib/wikidata/shops'

import {costForAdditionalShop} from '../lib/game-math/shop-cost'

import {buttonText, menuPhoto} from '../lib/interface/menu'
import {emojis} from '../lib/interface/emojis'
import {infoHeader, labeledFloat} from '../lib/interface/formatted-strings'

function getConstruction(ctx: any): Construction {
	const session = ctx.session as Session
	const persist = ctx.persist as Persist

	const construction: Construction = session.construction || {
		possibleShops: []
	}

	const allShops = wdShops.allShops()
	const userShops = persist.shops.map(o => o.id)

	construction.possibleShops = construction.possibleShops
		.filter(o => allShops.includes(o))

	while (construction.possibleShops.length < 3) {
		construction.possibleShops.push(
			randomUnusedEntry(allShops, [...userShops, ...construction.possibleShops])
		)
	}

	session.construction = construction
	return construction
}

function menuText(ctx: any): string {
	const session = ctx.session as Session
	const persist = ctx.persist as Persist
	const cost = costForAdditionalShop(persist.shops.length)

	let text = ''
	text += infoHeader(ctx.wd.r('action.construction'), {
		titlePrefix: emojis.construction
	})
	text += '\n\n'

	text += labeledFloat(ctx.wd.r('other.money'), session.money, emojis.currency)
	text += '\n'
	text += labeledFloat(ctx.wd.r('other.cost'), cost, emojis.currency)
	text += '\n\n'

	if (cost < session.money) {
		text += Object.keys(constructionOptions(ctx))
			.map(o => infoHeader(ctx.wd.r(o), {titlePrefix: emojis.shop}))
			.join('\n\n')
	}

	return text
}

const menu = new TelegrafInlineMenu(menuText, {
	photo: menuPhoto('action.construction')
})

function constructionOptions(ctx: any): Dictionary<string> {
	const {__wikibase_language_code: locale} = ctx.session as Session
	const construction = getConstruction(ctx)

	const labels: Dictionary<string> = {}
	for (const shopId of construction.possibleShops) {
		labels[shopId] = ctx.wd.r(shopId).label()
	}

	return sortDictByValue(labels, locale === 'wikidatanish' ? 'en' : locale)
}

menu.select('s', constructionOptions, {
	columns: 1,
	setParentMenuAfter: true,
	prefixFunc: () => emojis.construction + emojis.shop,
	setFunc: (ctx: any, key) => {
		const session = ctx.session as Session
		const persist = ctx.persist as Persist
		const now = Math.floor(Date.now() / 1000)

		const cost = costForAdditionalShop(persist.shops.length)
		if (session.money < cost) {
			// Fishy
			throw new Error('not enough money for construction')
		}

		const newShop: Shop = {
			id: key,
			opening: now,
			personal: {},
			products: []
		}

		session.money -= cost
		delete session.construction
		persist.shops.push(newShop)
	}
})

menu.urlButton(
	buttonText(emojis.wikidataItem, 'menu.wikidataItem'),
	(ctx: any) => ctx.wd.r('action.construction').url()
)

export default menu
