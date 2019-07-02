import TelegrafInlineMenu from 'telegraf-inline-menu'

import {Person} from '../lib/types/people'
import {Session} from '../lib/types'

import {buttonText, menuPhoto} from '../lib/interface/menu'
import {personMarkdown} from '../lib/interface/person'
import emoji from '../lib/interface/emojis'

function fromCtx(ctx: any): {applicantId: number; applicant: Person} {
	const applicantId = Number(ctx.match[1])
	const applicant: Person = ctx.session.applicants[applicantId]
	return {applicantId, applicant}
}

function menuText(ctx: any): string {
	const {applicant} = fromCtx(ctx)
	return personMarkdown(ctx, applicant)
}

const menu = new TelegrafInlineMenu(menuText, {
	photo: menuPhoto(ctx => fromCtx(ctx).applicant.hobby)
})

menu.urlButton(
	(ctx: any) => `${emoji.wikidataItem}${emoji.hobby} ${ctx.wd.r('person.hobby').label()} ${ctx.wd.r(fromCtx(ctx).applicant.hobby).label()}`,
	(ctx: any) => ctx.wd.r(fromCtx(ctx).applicant.hobby).url()
)

menu.button(buttonText(emoji.employmentTermination, 'action.employmentTermination'), 'remove', {
	setParentMenuAfter: true,
	doFunc: (ctx: any) => {
		const {applicantId} = fromCtx(ctx)
		ctx.session.applicants.splice(applicantId, 1)
	}
})

export default menu
