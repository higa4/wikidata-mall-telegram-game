import TelegrafInlineMenu from 'telegraf-inline-menu'

import {Session, Persist} from '../lib/types'
import {Shop} from '../lib/types/shop'
import {TalentName, Person} from '../lib/types/people'

import {personalBonusWhenEmployed} from '../lib/game-math/personal'

import {buttonText} from '../lib/interface/menu'
import {infoHeader, bonusPercentString} from '../lib/interface/formatted-strings'
import {personMarkdown} from '../lib/interface/person'
import emojis from '../lib/interface/emojis'

import confirmEmployee from './shop-employee-confirm-applicant'

function fromCtx(ctx: any): {shop: Shop; talent: TalentName; person?: Person} {
	const shopType = ctx.match[1]
	const talent = ctx.match[2] as TalentName

	const persist = ctx.persist as Persist
	const shop = persist.shops.filter(o => o.id === shopType)[0]
	const person = shop.personal[talent]

	return {shop, talent, person}
}

function menuText(ctx: any): string {
	const {talent, person} = fromCtx(ctx)

	let text = ''
	text += infoHeader(ctx.wd.r(`person.talents.${talent}`), {titlePrefix: emojis[talent]})
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
	const session = ctx.session as Session
	if (fromCtx(ctx).person) {
		return []
	}

	return Object.keys(session.applicants)
}

menu.selectSubmenu('a', availableApplicants, confirmEmployee, {
	columns: 1,
	textFunc: (ctx: any, key) => {
		const {shop, talent} = fromCtx(ctx)
		const session = ctx.session as Session
		const applicant = session.applicants[Number(key)]

		const {name} = applicant

		const bonus = personalBonusWhenEmployed(shop, talent, applicant)
		const bonusString = bonusPercentString(bonus)

		const isHobby = applicant.hobby === shop.id
		const hobbyString = isHobby ? emojis.hobby + ' ' : ''

		return `${name.given} ${name.family} (${hobbyString}${bonusString})`
	}
})

export default menu
