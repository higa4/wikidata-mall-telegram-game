import TelegrafInlineMenu from 'telegraf-inline-menu'

import {Dictionary} from '../lib/js-helper/dictionary'

import {Session, Persist} from '../lib/types'
import {Shop} from '../lib/types/shop'
import {TalentName, Person} from '../lib/types/people'

import {personalBonusWhenEmployed} from '../lib/game-math/personal'

import {buttonText} from '../lib/interface/menu'
import {emojis} from '../lib/interface/emojis'
import {infoHeader} from '../lib/interface/formatted-strings'
import {percentBonusString} from '../lib/interface/format-percent'
import {personMarkdown} from '../lib/interface/person'

import {createHelpMenu, helpButtonText} from './help'
import confirmEmployee from './shop-employee-confirm-applicant'

function fromCtx(ctx: any): {shop: Shop; talent: TalentName; employee?: Person} {
	const shopType = ctx.match[1]
	const talent = ctx.match[2] as TalentName

	const persist = ctx.persist as Persist
	const shop = persist.shops.filter(o => o.id === shopType)[0]
	const employee = shop.personal[talent]

	return {shop, talent, employee}
}

function menuText(ctx: any): string {
	const {talent, employee} = fromCtx(ctx)

	let text = ''
	text += infoHeader(ctx.wd.r(`person.talents.${talent}`), {titlePrefix: emojis[talent]})
	text += '\n\n'

	if (employee) {
		text += personMarkdown(ctx, employee)
	} else {
		text += emojis.noPerson
	}

	return text
}

const menu = new TelegrafInlineMenu(menuText)

menu.button(buttonText(emojis.employmentTermination, 'action.employmentTermination'), 'remove', {
	hide: ctx => !fromCtx(ctx).employee,
	doFunc: (ctx: any) => {
		const {shop, talent} = fromCtx(ctx)
		delete shop.personal[talent]
	}
})

menu.button(buttonText(emojis.seat, 'action.demotion'), 'toApplicants', {
	hide: ctx => !fromCtx(ctx).employee,
	doFunc: (ctx: any) => {
		const session = ctx.session as Session
		const {shop, talent} = fromCtx(ctx)

		const person = shop.personal[talent]
		if (!person) {
			// What?
			return
		}

		session.applicants.push(person)
		delete shop.personal[talent]
	}
})

function availableApplicants(ctx: any): string[] {
	const session = ctx.session as Session
	const {employee, shop, talent} = fromCtx(ctx)
	const currentBonus = personalBonusWhenEmployed(shop, talent, employee)

	const applicantBoni: Dictionary<number> = {}
	for (let i = 0; i < session.applicants.length; i++) {
		const applicant = session.applicants[i]
		applicantBoni[i] = personalBonusWhenEmployed(shop, talent, applicant)
	}

	const indiciesOfInterest = session.applicants
		.map((_, i) => i)
		.filter(i => applicantBoni[i] > currentBonus)
		.sort((a, b) => applicantBoni[b] - applicantBoni[a])

	return indiciesOfInterest.map(o => String(o))
}

menu.selectSubmenu('a', availableApplicants, confirmEmployee, {
	columns: 1,
	textFunc: (ctx: any, key) => {
		const {shop, talent} = fromCtx(ctx)
		const session = ctx.session as Session
		const applicant = session.applicants[Number(key)]

		const {name} = applicant

		const bonus = personalBonusWhenEmployed(shop, talent, applicant)
		const bonusString = percentBonusString(bonus)

		const isHobby = applicant.hobby === shop.id
		const hobbyString = isHobby ? emojis.hobby + ' ' : ''

		return `${name.given} ${name.family} (${hobbyString}${bonusString})`
	}
})

menu.urlButton(
	buttonText(emojis.wikidataItem, 'menu.wikidataItem'),
	(ctx: any) => ctx.wd.r(`person.talents.${fromCtx(ctx).talent}`).url()
)

menu.submenu(helpButtonText(), 'help', createHelpMenu('help.shop-employees'))

export default menu
