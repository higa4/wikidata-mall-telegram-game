import TelegrafInlineMenu from 'telegraf-inline-menu'

import {Person} from '../lib/types/people'
import {Session, Persist} from '../lib/types'

import {applicantSeats} from '../lib/game-math/applicant'

import {buttonText, menuPhoto} from '../lib/interface/menu'
import {emojis} from '../lib/interface/emojis'
import {personMarkdown} from '../lib/interface/person'

import {createHelpMenu, helpButtonText} from './help'

function fromCtx(ctx: any): {applicant: Person; hobbyIsFitting: boolean} {
	const session = ctx.session as Session
	const persist = ctx.persist as Persist
	const applicant = session.applicantWaiting
	if (!applicant) {
		throw new Error('The applicant you are looking for is not there.')
	}

	const shopIds = persist.shops.map(o => o.id)
	const hobbyIsFitting = shopIds.some(o => o === applicant.hobby)
	return {applicant, hobbyIsFitting}
}

function menuText(ctx: any): string {
	const {applicant, hobbyIsFitting} = fromCtx(ctx)
	return emojis.applicantNew + personMarkdown(ctx, applicant, hobbyIsFitting)
}

const menu = new TelegrafInlineMenu(menuText, {
	photo: menuPhoto(ctx => fromCtx(ctx).applicant.hobby)
})

function freeSeatAvailable(ctx: any): boolean {
	const session = ctx.session as Session
	const persist = ctx.persist as Persist
	const maxSeats = applicantSeats(persist.skills)
	const freeSeats = maxSeats - session.applicants.length
	return freeSeats > 0
}

menu.button(buttonText(emojis.seat, 'other.seat'), 'keep', {
	setParentMenuAfter: true,
	hide: (ctx: any) => !freeSeatAvailable(ctx),
	doFunc: (ctx: any) => {
		const session = ctx.session as Session
		const now = Math.floor(Date.now() / 1000)
		if (!session.applicantWaiting) {
			return
		}

		session.applicants.push(session.applicantWaiting)
		delete session.applicantWaiting
		session.applicantTimestamp = now
	}
})

menu.simpleButton(buttonText(emojis.seat, 'other.seat'), 'keep-impossible', {
	joinLastRow: true,
	hide: (ctx: any) => freeSeatAvailable(ctx),
	doFunc: async (ctx: any) => {
		const session = ctx.session as Session
		const persist = ctx.persist as Persist
		const maxSeats = applicantSeats(persist.skills)
		let text = ''
		text += emojis.warning
		text += session.applicants.length
		text += ' / '
		text += maxSeats
		text += emojis.seat

		await ctx.answerCbQuery(text)
	}
})

menu.button(buttonText(emojis.door, 'other.door'), 'remove', {
	setParentMenuAfter: true,
	joinLastRow: true,
	doFunc: (ctx: any) => {
		const session = ctx.session as Session
		const now = Math.floor(Date.now() / 1000)
		delete session.applicantWaiting
		session.applicantTimestamp = now
	}
})

menu.urlButton(
	(ctx: any) => {
		const {applicant, hobbyIsFitting} = fromCtx(ctx)
		const hobby = hobbyIsFitting ? emojis.hobbyMatch : emojis.hobbyDifferent
		return `${emojis.wikidataItem}${hobby} ${ctx.wd.r('person.hobby').label()} ${ctx.wd.r(applicant.hobby).label()}`
	},
	(ctx: any) => ctx.wd.r(fromCtx(ctx).applicant.hobby).url()
)

menu.submenu(helpButtonText(), 'help', createHelpMenu('help.applicants'))

export default menu
