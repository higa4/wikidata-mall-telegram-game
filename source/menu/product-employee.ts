import TelegrafInlineMenu from 'telegraf-inline-menu'

import {Session} from '../lib/types'
import {Shop} from '../lib/types/shop'
import {TalentName, Person} from '../lib/types/people'

import {buttonText} from '../lib/interface/menu'
import {infoHeader} from '../lib/interface/formatted-strings'
import {personMarkdown} from '../lib/interface/person'
import emojis from '../lib/interface/emojis'

import confirmEmployee from './product-employee-confirm-applicant'

function fromCtx(ctx: any): {shop: Shop; talent: TalentName; person?: Person} {
	const shopType = ctx.match[1]
	const talent = ctx.match[2] as TalentName

	const session = ctx.session as Session
	const shop = session.shops.filter(o => o.id === shopType)[0]
	const person = shop.personal[talent]

	return {shop, talent, person}
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
		const {shop, talent} = fromCtx(ctx)
		delete shop.personal[talent]
	}
})

function availableApplicants(ctx: any): string[] {
	if (fromCtx(ctx).person) {
		return []
	}

	return Object.keys(ctx.session.applicants)
}

menu.selectSubmenu('a', availableApplicants, confirmEmployee, {
	columns: 2,
	textFunc: (ctx: any, key) => {
		const session = ctx.session as Session
		const {name} = session.applicants[Number(key)]
		return `${name.given} ${name.family}`
	}
})

export default menu
