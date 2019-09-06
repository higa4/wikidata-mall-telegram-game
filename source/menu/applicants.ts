import TelegrafInlineMenu from 'telegraf-inline-menu'

import {Session, Persist} from '../lib/types'
import {Person} from '../lib/types/people'

import {currentLevel} from '../lib/game-math/skill'
import {secondsBetweenApplicants, maxDaysUntilRetirement, applicantSeats} from '../lib/game-math/applicant'

import {emojis} from '../lib/interface/emojis'
import {formatInt, formatFloat} from '../lib/interface/format-number'
import {humanReadableTimestamp} from '../lib/interface/formatted-time'
import {infoHeader} from '../lib/interface/formatted-strings'
import {menuPhoto, buttonText} from '../lib/interface/menu'
import {personAllTalentsLine, nameMarkdown} from '../lib/interface/person'

import applicantMenu from './applicant'

function applicantEntry(ctx: any, applicant: Person, isHobbyFitting: boolean): string {
	const {__wikibase_language_code: locale} = ctx.session as Session

	let text = ''
	if (isHobbyFitting) {
		text += emojis.hobby
	}

	text += nameMarkdown(applicant.name)
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

	const applicantSeatsLevel = currentLevel(persist.skills, 'applicantSeats')
	const maxSeats = applicantSeats(persist.skills)

	const applicantSpeedLevel = currentLevel(persist.skills, 'applicantSpeed')
	const interval = secondsBetweenApplicants(persist.skills)

	const healthCareLevel = currentLevel(persist.skills, 'healthCare')
	const retirementDays = maxDaysUntilRetirement(persist.skills)

	let text = ''
	text += infoHeader(ctx.wd.r('menu.applicant'))
	text += '\n\n'

	text += emojis.seat
	text += ctx.wd.r('other.seat').label()
	text += ': '
	text += session.applicants.length
	text += ' / '
	text += maxSeats
	text += emojis.seat
	text += '\n'
	if (!session.hideExplanationMath && applicantSeatsLevel > 0) {
		text += '  '
		text += emojis.skill
		text += ctx.wd.r('skill.applicantSeats').label()
		text += ': '
		text += applicantSeatsLevel
		text += '\n'
	}

	text += '+1'
	text += emojis.person
	text += ' / '
	text += formatInt(interval)
	text += ' '
	text += ctx.wd.r('unit.second').label()
	text += '\n'
	if (!session.hideExplanationMath && applicantSpeedLevel > 0) {
		text += '  '
		text += emojis.skill
		text += ctx.wd.r('skill.applicantSpeed').label()
		text += ': '
		text += applicantSpeedLevel
		text += '\n'
	}

	text += emojis.retirement
	text += ctx.wd.r('person.retirement').label()
	text += ': '
	text += '≤'
	text += formatInt(retirementDays)
	text += ' '
	text += ctx.wd.r('unit.day').label()
	text += '\n'
	if (!session.hideExplanationMath && healthCareLevel > 0) {
		text += '  '
		text += emojis.skill
		text += ctx.wd.r('skill.healthCare').label()
		text += ': '
		text += healthCareLevel
		text += '\n'
	}

	text += '\n'
	if (session.applicants.length > 0) {
		const shopIds = persist.shops.map(o => o.id)
		text += session.applicants
			.map(o => applicantEntry(ctx, o, shopIds.includes(o.hobby)))
			.join('\n')
		text += '\n\n'
	}

	if (session.applicants.length < maxSeats) {
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

menu.selectSubmenu('a', availableApplicants, applicantMenu, {
	columns: 2,
	textFunc: (ctx: any, key) => {
		const session = ctx.session as Session
		const persist = ctx.persist as Persist
		const {name, hobby} = session.applicants[Number(key)]
		const hasShopOfHobby = persist.shops.some(o => o.id === hobby)
		const hasShopOfHobbyString = hasShopOfHobby ? emojis.hobby : ''
		return `${hasShopOfHobbyString}${name.given} ${name.family}`
	}
})

menu.urlButton(
	buttonText(emojis.wikidataItem, 'menu.wikidataItem'),
	(ctx: any) => ctx.wd.r('menu.applicant').url()
)

export default menu
