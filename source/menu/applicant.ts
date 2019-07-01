import TelegrafInlineMenu from 'telegraf-inline-menu'
import WikidataEntityReader from 'wikidata-entity-reader'

import {Person, TalentName} from '../lib/types/people'

import emoji from '../lib/interface/emojis'
import {buttonText} from '../lib/interface/button'

function fromCtx(ctx: any): {applicantId: number; applicant: Person} {
	const applicantId = Number(ctx.match[1])
	const applicant: Person = ctx.session.applicants[applicantId]
	return {applicantId, applicant}
}

function percentageString(percent: number): string {
	const plusMinusHundred = (percent - 1) * 100
	return `${plusMinusHundred > 0 ? '+' : ''}${plusMinusHundred.toFixed(1)}%`
}

function talentLine(ctx: any, t: TalentName, percentage: number): string {
	const reader = ctx.wd.r(`person.talents.${t}`) as WikidataEntityReader
	return `${emoji[t]} ${reader.label()}: ${percentageString(percentage)}`
}

function menuText(ctx: any): string {
	const {applicant} = fromCtx(ctx)
	const {name, hobby, retirementTimestamp, talents} = applicant

	let text = ''
	text += `*${name.given}* ${name.family}`
	text += '\n\n'

	text += emoji.hobby
	text += '*'
	text += ctx.wd.r('person.hobby').label()
	text += '*\n  '
	text += ctx.wd.r(hobby).label()
	text += '\n'

	text += emoji.retirement
	text += '*'
	text += ctx.wd.r('person.retirement').label()
	text += '*\n  '
	text += new Date(retirementTimestamp * 1000).toUTCString()
	text += '\n'

	text += '\n'
	text += '*'
	text += ctx.wd.r('person.talent').label()
	text += '*'
	text += '\n'

	text += (Object.keys(talents) as TalentName[])
		.map(t => talentLine(ctx, t, talents[t]))
		.join('\n')

	return text
}

const menu = new TelegrafInlineMenu(menuText, {
	photo: (ctx: any) => ctx.wd.r(fromCtx(ctx).applicant.hobby).images(800)[0]
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
