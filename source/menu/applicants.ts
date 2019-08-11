import TelegrafInlineMenu from 'telegraf-inline-menu'

import {Session, Persist} from '../lib/types'

import {currentLevel} from '../lib/game-math/skill'
import {secondsBetweenApplicants, maxDaysUntilRetirement} from '../lib/game-math/applicant'

import {emojis} from '../lib/interface/emojis'
import {formatInt} from '../lib/interface/format-number'
import {infoHeader} from '../lib/interface/formatted-strings'
import {menuPhoto, buttonText} from '../lib/interface/menu'

import applicantMenu from './applicant'

function menuText(ctx: any): string {
	const session = ctx.session as Session
	const persist = ctx.persist as Persist

	const applicantSpeedLevel = currentLevel(persist.skills, 'applicantSpeed')
	const interval = secondsBetweenApplicants(persist.skills)

	const healthCareLevel = currentLevel(persist.skills, 'healthCare')
	const retirementDays = maxDaysUntilRetirement(persist.skills)

	let text = ''
	text += infoHeader(ctx.wd.r('menu.applicant'))
	text += '\n\n'

	text += '+1'
	text += emojis.person
	text += ' / '
	text += formatInt(interval)
	text += ' '
	text += ctx.wd.r('unit.second').label()
	text += '\n'
	if (applicantSpeedLevel > 0) {
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
	if (healthCareLevel > 0) {
		text += '  '
		text += emojis.skill
		text += ctx.wd.r('skill.healthCare').label()
		text += ': '
		text += healthCareLevel
		text += '\n'
	}

	text += '\n'
	text += ctx.wd.r('other.seat').label()
	text += ' '
	text += session.applicants.length
	text += ' / '
	text += persist.shops.length
	text += emojis.seat
	text += '\n'

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
