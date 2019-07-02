import WikidataEntityReader from 'wikidata-entity-reader'

import {Person, TalentName} from '../types/people'

import {bonusPercentString} from './formatted-strings'
import emojis from './emojis'

export function personMarkdown(ctx: any, person: Person): string {
	const {name, hobby, retirementTimestamp, talents} = person

	let text = ''
	text += `*${name.given}* ${name.family}`
	text += '\n\n'

	text += emojis.hobby
	text += '*'
	text += ctx.wd.r('person.hobby').label()
	text += '*\n  '
	text += ctx.wd.r(hobby).label()
	text += '\n'

	text += emojis.retirement
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

function talentLine(ctx: any, t: TalentName, percentage: number): string {
	const reader = ctx.wd.r(`person.talents.${t}`) as WikidataEntityReader
	return `${emojis[t]} ${reader.label()}: ${bonusPercentString(percentage)}`
}

