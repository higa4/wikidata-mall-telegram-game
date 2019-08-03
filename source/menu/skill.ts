import TelegrafInlineMenu from 'telegraf-inline-menu'

import {Session, Persist} from '../lib/types'
import {Skills} from '../lib/types/skills'

import {currentLevel, skillUpgradeEndTimestamp} from '../lib/game-math/skill'

import {countdownHourMinute} from '../lib/interface/formatted-time'
import {infoHeader} from '../lib/interface/formatted-strings'
import {menuPhoto, buttonText} from '../lib/interface/menu'
import {skillInTrainingString} from '../lib/interface/skill'
import emoji from '../lib/interface/emojis'

function fromCtx(ctx: any): {skill: keyof Skills; category?: string} {
	const skill = ctx.match[1]
	const category = ctx.match[2]

	return {
		skill,
		category
	}
}

function menuText(ctx: any): string {
	const session = ctx.session as Session
	const persist = ctx.persist as Persist
	const {skill, category} = fromCtx(ctx)

	const level = currentLevel(persist.skills, skill, category)

	let text = ''
	text += infoHeader(ctx.wd.r(`skill.${skill}`), {titlePrefix: emoji.skill})
	text += '\n\n'

	if (category) {
		text += ctx.wd.r(category).label()
		text += '\n'
	}

	text += ctx.wd.r('skill.level').label()
	text += ': '
	text += level
	text += '\n'

	text += ctx.wd.r('action.research').label()
	text += ': '
	text += countdownHourMinute(skillUpgradeEndTimestamp(level, 0))
	text += '\n'

	if (session.skillInTraining) {
		text += '\n'
		text += skillInTrainingString(ctx, session.skillInTraining)
		text += '\n\n'
	}

	return text
}

const menu = new TelegrafInlineMenu(menuText, {
	photo: menuPhoto(ctx => `skill.${fromCtx(ctx).skill}`)
})

menu.button(buttonText(emoji.skill, 'action.research'), 'research', {
	hide: (ctx: any) => {
		const session = ctx.session as Session
		return Boolean(session.skillInTraining)
	},
	doFunc: (ctx: any) => {
		const session = ctx.session as Session
		const persist = ctx.persist as Persist
		if (session.skillInTraining) {
			return
		}

		const {skill, category} = fromCtx(ctx)
		const now = Math.floor(Date.now() / 1000)
		const level = currentLevel(persist.skills, skill, category)
		const endTimestamp = skillUpgradeEndTimestamp(level, now)
		session.skillInTraining = {
			skill,
			category,
			endTimestamp
		}
	}
})

menu.urlButton(
	buttonText(emoji.wikidataItem, 'menu.wikidataItem'),
	(ctx: any) => ctx.wd.r(`skill.${fromCtx(ctx).skill}`).url()
)

export default menu
