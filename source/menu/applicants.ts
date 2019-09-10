import TelegrafInlineMenu from 'telegraf-inline-menu'

import {Person} from '../lib/types/people'
import {Session, Persist} from '../lib/types'
import {Shop} from '../lib/types/shop'

import {secondsBetweenApplicants} from '../lib/game-math/applicant'

import {applicantInfluencesPart} from '../lib/interface/applicants'
import {emojis} from '../lib/interface/emojis'
import {formatFloat} from '../lib/interface/format-number'
import {humanReadableTimestamp} from '../lib/interface/formatted-time'
import {infoHeader} from '../lib/interface/formatted-strings'
import {menuPhoto, buttonText} from '../lib/interface/menu'
import {personAllTalentsLine, nameMarkdown} from '../lib/interface/person'

import {createHelpMenu, helpButtonText} from './help'
import applicantMenu from './applicant'
import applicantWaitingMenu from './applicant-waiting'

function applicantEntry(ctx: any, applicant: Person, isHobbyFitting: boolean): string {
	const {__wikibase_language_code: locale} = ctx.session as Session

	let text = ''
	text += nameMarkdown(applicant.name)
	text += '\n  '
	text += isHobbyFitting ? emojis.hobbyMatch : emojis.hobbyDifferent
	text += ctx.wd.r(applicant.hobby).label()
	text += '\n  '
	text += emojis.retirement
	text += humanReadableTimestamp(applicant.retirementTimestamp, locale)
	text += '\n  '
	text += personAllTalentsLine(applicant.talents)

	return text
}

function menuText(ctx: any): string {
	const session = ctx.session as Session
	const persist = ctx.persist as Persist
	const now = Date.now() / 1000

	const interval = secondsBetweenApplicants(persist.skills)
	const shopIds = persist.shops.map(o => o.id)

	let text = ''
	text += infoHeader(ctx.wd.r('menu.applicant'))
	text += '\n\n'

	text += applicantInfluencesPart(ctx, persist.skills, session.applicants.length, session.hideExplanationMath)

	text += '\n'
	if (session.applicants.length > 0) {
		text += session.applicants
			.map(o => applicantEntry(ctx, o, shopIds.includes(o.hobby)))
			.join('\n')
		text += '\n\n'
	}

	text += emojis.applicantNew
	if (session.applicantWaiting) {
		text += applicantEntry(ctx, session.applicantWaiting, shopIds.includes(session.applicantWaiting.hobby))
		text += '\n\n'
	} else {
		const secondsUntilNext = (session.applicantTimestamp + interval) - now
		text += ctx.wd.r('other.countdown').label()
		text += ': '
		text += formatFloat(secondsUntilNext)
		text += ' '
		text += ctx.wd.r('unit.second').label()
		text += '\n\n'
	}

	return text
}

const menu = new TelegrafInlineMenu(menuText, {
	photo: menuPhoto('menu.applicant')
})

function availableApplicants(ctx: any): string[] {
	const session = ctx.session as Session
	return Object.keys(session.applicants)
}

function applicantButtonText(applicant: Person, shops: readonly Shop[]): string {
	const {name, hobby} = applicant
	const hasShopOfHobby = shops.some(o => o.id === hobby)
	const hasShopOfHobbyString = hasShopOfHobby ? emojis.hobbyMatch : ''
	return `${hasShopOfHobbyString}${name.given} ${name.family}`
}

menu.selectSubmenu('a', availableApplicants, applicantMenu, {
	columns: 2,
	textFunc: (ctx: any, key) => {
		const session = ctx.session as Session
		const persist = ctx.persist as Persist
		const applicant = session.applicants[Number(key)]
		return applicantButtonText(applicant, persist.shops)
	}
})

function applicantWaitingButtonText(ctx: any): string {
	const session = ctx.session as Session
	const persist = ctx.persist as Persist
	return emojis.applicantNew + applicantButtonText(session.applicantWaiting!, persist.shops)
}

menu.submenu(applicantWaitingButtonText, 'new', applicantWaitingMenu, {
	hide: (ctx: any) => {
		const session = ctx.session as Session
		return !session.applicantWaiting
	}
})

menu.urlButton(
	buttonText(emojis.wikidataItem, 'menu.wikidataItem'),
	(ctx: any) => ctx.wd.r('menu.applicant').url()
)

menu.submenu(helpButtonText(), 'help', createHelpMenu('help.applicants'))

export default menu
