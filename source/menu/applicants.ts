import TelegrafInlineMenu from 'telegraf-inline-menu'

import {Person} from '../lib/types/people'
import {Session, Persist} from '../lib/types'

import {secondsBetweenApplicants} from '../lib/game-math/applicant'

import {applicantInfluencesPart} from '../lib/interface/applicants'
import {buttonText, menuPhoto} from '../lib/interface/menu'
import {emojis} from '../lib/interface/emojis'
import {formatFloat} from '../lib/interface/format-number'
import {infoHeader} from '../lib/interface/formatted-strings'
import {personMarkdown} from '../lib/interface/person'

import {createHelpMenu, helpButtonText} from './help'

function fromCtx(ctx: any): {applicantId: number; applicant: Person; hobbyIsFitting: boolean} | undefined {
	const session = ctx.session as Session
	const persist = ctx.persist as Persist
	const availableApplicants = session.applicants.length
	if (availableApplicants === 0) {
		return undefined
	}

	const shopIds = persist.shops.map(o => o.id)
	const applicantId = Math.max(1, Math.min(availableApplicants, session.page || 1)) - 1
	const applicant: Person = session.applicants[applicantId]
	const hobbyIsFitting = shopIds.some(o => o === applicant.hobby)

	return {applicantId, applicant, hobbyIsFitting}
}

function fromCtxButThrowing(ctx: any): {applicantId: number; applicant: Person; hobbyIsFitting: boolean} {
	const info = fromCtx(ctx)
	if (!info) {
		throw new Error('These aren\'t the applicants you are looking for')
	}

	return info
}

function menuText(ctx: any): string {
	const session = ctx.session as Session
	const persist = ctx.persist as Persist
	const info = fromCtx(ctx)
	const now = Date.now() / 1000

	let text = ''
	text += infoHeader(ctx.wd.r('menu.applicant'))
	text += '\n\n'

	text += applicantInfluencesPart(ctx, persist.skills, session.applicants.length, session.hideExplanationMath)
	text += '\n'

	if (info) {
		text += personMarkdown(ctx, info.applicant, info.hobbyIsFitting)
	} else {
		const interval = secondsBetweenApplicants(persist.skills)
		const secondsUntilNext = (session.applicantTimestamp + interval) - now
		text += ctx.wd.r('other.countdown').label()
		text += ': '
		text += formatFloat(secondsUntilNext)
		text += ' '
		text += ctx.wd.r('unit.second').label()
	}

	return text
}

const menu = new TelegrafInlineMenu(menuText, {
	photo: menuPhoto(ctx => {
		const info = fromCtx(ctx)
		return info && info.applicant.hobby
	})
})

menu.pagination('page', {
	getTotalPages: (ctx: any) => {
		const session = ctx.session as Session
		return session.applicants.length
	},
	getCurrentPage: (ctx: any) => {
		const session = ctx.session as Session
		return session.page
	},
	setPage: (ctx: any, page) => {
		const session = ctx.session as Session
		session.page = page
	}
})

menu.button(buttonText(emojis.employmentTermination, 'action.employmentTermination'), 'remove', {
	hide: (ctx: any) => {
		const session = ctx.session as Session
		return session.applicants.length === 0
	},
	doFunc: (ctx: any) => {
		const info = fromCtx(ctx)
		if (!info) {
			return
		}

		const session = ctx.session as Session
		session.applicants.splice(info.applicantId, 1)
	}
})

menu.urlButton(
	buttonText(emojis.wikidataItem, 'menu.applicant'),
	(ctx: any) => ctx.wd.r('menu.applicant').url()
)

menu.urlButton(
	(ctx: any) => {
		const info = fromCtxButThrowing(ctx)
		const hobby = info.hobbyIsFitting ? emojis.hobbyMatch : emojis.hobbyDifferent
		return `${emojis.wikidataItem}${hobby} ${ctx.wd.r('person.hobby').label()} ${ctx.wd.r(info.applicant.hobby).label()}`
	},
	(ctx: any) => ctx.wd.r(fromCtxButThrowing(ctx).applicant.hobby).url(), {
		joinLastRow: true,
		hide: (ctx: any) => {
			const session = ctx.session as Session
			return session.applicants.length === 0
		}
	}
)

menu.submenu(helpButtonText(), 'help', createHelpMenu('help.applicants'))

export default menu
