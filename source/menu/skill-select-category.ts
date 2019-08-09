import TelegrafInlineMenu from 'telegraf-inline-menu'

import {Session, Persist} from '../lib/types'
import {Skills} from '../lib/types/skills'

import {currentLevel, isSimpleSkill} from '../lib/game-math/skill'

import {infoHeader} from '../lib/interface/formatted-strings'
import {menuPhoto, buttonText} from '../lib/interface/menu'
import {skillInTrainingString} from '../lib/interface/skill'
import emojis from '../lib/interface/emojis'

import skillMenu from './skill'

function fromCtx(ctx: any): {skill: keyof Skills} {
	const skill = ctx.match[1]

	return {
		skill
	}
}

function categorySkillLine(ctx: any, skills: Skills, skill: keyof Skills, product: string): string {
	let text = ''
	text += ctx.wd.r(product).label()
	text += ': '
	text += isSimpleSkill(skill) ? currentLevel(skills, skill) : currentLevel(skills, skill, product)
	return text
}

function menuText(ctx: any): string {
	const session = ctx.session as Session
	const persist = ctx.persist as Persist
	const {skill} = fromCtx(ctx)

	let text = ''
	text += infoHeader(ctx.wd.r(`skill.${skill}`), {titlePrefix: emojis.skill})
	text += '\n\n'

	const categories = Object.keys(persist.skills[skill] || {})
	if (categories.length > 0) {
		text += '*'
		text += ctx.wd.r('skill.level').label()
		text += '*'
		text += '\n'

		text +=	categories
			.map(o => categorySkillLine(ctx, persist.skills, skill, o))
			.join('\n')

		text += '\n\n'
	}

	if (session.skillInTraining) {
		text += skillInTrainingString(ctx, session.skillInTraining)
		text += '\n\n'
	}

	return text
}

const menu = new TelegrafInlineMenu(menuText, {
	photo: menuPhoto(ctx => `skill.${fromCtx(ctx).skill}`)
})

function shops(ctx: any): string[] {
	const persist = ctx.persist as Persist
	return persist.shops.map(o => o.id)
}

menu.selectSubmenu('s', shops, skillMenu, {
	columns: 2,
	textFunc: (ctx: any, key) => ctx.wd.r(key).label()
})

menu.urlButton(
	buttonText(emojis.wikidataItem, 'menu.wikidataItem'),
	(ctx: any) => ctx.wd.r(`skill.${fromCtx(ctx).skill}`).url()
)

export default menu
