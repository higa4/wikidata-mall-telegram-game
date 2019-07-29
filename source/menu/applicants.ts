import TelegrafInlineMenu from 'telegraf-inline-menu'

import {Session, Persist} from '../lib/types'

import {secondsBetweenApplicants} from '../lib/game-math/applicant'

import {infoHeader, formattedNumber} from '../lib/interface/formatted-strings'
import {menuPhoto} from '../lib/interface/menu'
import emojis from '../lib/interface/emojis'

import applicantMenu from './applicant'

function menuText(ctx: any): string {
	const session = ctx.session as Session
	const persist = ctx.persist as Persist

	const interval = secondsBetweenApplicants(persist.skills)

	let text = ''
	text += infoHeader(ctx.wd.r('menu.applicant'))
	text += '\n\n'

	text += '+1'
	text += emojis.person
	text += ' / '
	text += formattedNumber(interval, true)
	text += ' '
	text += 'sec' // TODO: wikidata item
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
		const {name} = session.applicants[Number(key)]
		return `${name.given} ${name.family}`
	}
})

export default menu
