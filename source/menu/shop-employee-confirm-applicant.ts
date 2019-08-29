import TelegrafInlineMenu from 'telegraf-inline-menu'

import {Session, Persist} from '../lib/types'
import {Shop} from '../lib/types/shop'
import {TalentName, Person} from '../lib/types/people'

import {buttonText} from '../lib/interface/menu'
import {emojis} from '../lib/interface/emojis'
import {infoHeader} from '../lib/interface/formatted-strings'
import {personMarkdown} from '../lib/interface/person'

function fromCtx(ctx: any): {shop: Shop; talent: TalentName; employee?: Person; applicantId: number; applicant: Person} {
	const shopType = ctx.match[1]
	const talent = ctx.match[2] as TalentName
	const applicantId = Number(ctx.match[3])

	const session = ctx.session as Session
	const persist = ctx.persist as Persist
	const shop = persist.shops.filter(o => o.id === shopType)[0]
	const employee = shop.personal[talent]
	const applicant = session.applicants[applicantId]

	if (!applicant) {
		throw new Error('These aren\'t the applicants you are looking for')
	}

	return {shop, talent, employee, applicantId, applicant}
}

function menuText(ctx: any): string {
	const {talent, applicant} = fromCtx(ctx)

	let text = ''
	text += infoHeader(ctx.wd.r(`person.talents.${talent}`), {titlePrefix: emojis[talent]})
	text += '\n\n'

	text += personMarkdown(ctx, applicant)

	return text
}

const menu = new TelegrafInlineMenu(menuText)

menu.button(buttonText(emojis.yes + emojis.recruitment, 'action.recruitment'), 'recruit', {
	setParentMenuAfter: true,
	doFunc: (ctx: any) => {
		const now = Date.now() / 1000
		const {shop, talent, employee, applicantId, applicant} = fromCtx(ctx)
		const session = ctx.session as Session

		if (employee) {
			session.applicants.push(employee)
		}

		shop.personal[talent] = applicant
		session.applicants.splice(applicantId, 1)
		session.applicantTimestamp = now
	}
})

export default menu
