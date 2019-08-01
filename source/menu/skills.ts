import TelegrafInlineMenu from 'telegraf-inline-menu'

import {Session, Persist} from '../lib/types'
import {Skills, SIMPLE_SKILLS, CATEGORY_SKILLS} from '../lib/types/skills'

import {currentLevel} from '../lib/game-math/skill'

import {infoHeader} from '../lib/interface/formatted-strings'
import {menuPhoto, buttonText} from '../lib/interface/menu'
import {skillInTrainingString} from '../lib/interface/skill'
import emoji from '../lib/interface/emojis'

import skillMenu from './skill'
import skillSelectCategory from './skill-select-category'

function simpleSkillPart(ctx: any, skills: Skills, skill: keyof Skills): string {
	if (!skills[skill]) {
		return ''
	}

	let text = ''
	text += ctx.wd.r(`skill.${skill}`).label()
	text += ': '
	text += currentLevel(skills, skill)

	return text
}

function productSkillPart(ctx: any, skills: Skills, skill: keyof Skills): string {
	if (!skills[skill]) {
		return ''
	}

	const products = Object.keys(skills[skill]!)
	if (products.length === 0) {
		return ''
	}

	let text = ''
	text += ctx.wd.r(`skill.${skill}`).label()
	text += '\n'
	text += products
		.map(o => productSkillPartLine(ctx, skills, skill, o))
		.map(o => `  ${o}`)
		.join('\n')

	return text
}

function productSkillPartLine(ctx: any, skills: Skills, skill: keyof Skills, product: string): string {
	let text = ''
	text += ctx.wd.r(product).label()
	text += ': '
	text += currentLevel(skills, skill, product)
	return text
}

function menuText(ctx: any): string {
	const session = ctx.session as Session
	const persist = ctx.persist as Persist

	let text = ''
	text += infoHeader(ctx.wd.r('menu.skill'), {titlePrefix: emoji.skill})
	text += '\n\n'

	const simpleSkillParts = SIMPLE_SKILLS
		.map(o => simpleSkillPart(ctx, persist.skills, o))
		.filter(o => o)

	const productSkillParts = CATEGORY_SKILLS
		.map(o => productSkillPart(ctx, persist.skills, o))
		.filter(o => o)

	if (simpleSkillParts.length + productSkillParts.length > 0) {
		text += '*'
		text += ctx.wd.r('skill.level').label()
		text += '*'

		if (simpleSkillParts.length > 0) {
			text += '\n'
			text += simpleSkillParts.join('\n')
		}

		if (productSkillParts.length > 0) {
			text += '\n\n'
			text += productSkillParts.join('\n\n')
		}

		text += '\n\n'
	}

	if (session.skillInTraining) {
		text += skillInTrainingString(ctx, persist.skills, session.skillInTraining)
		text += '\n\n'
	}

	return text
}

const menu = new TelegrafInlineMenu(menuText, {
	photo: menuPhoto('menu.skill')
})

menu.selectSubmenu('simple', SIMPLE_SKILLS, skillMenu, {
	columns: 2,
	textFunc: (ctx: any, key) => ctx.wd.r(`skill.${key}`).label()
})

menu.selectSubmenu('c', CATEGORY_SKILLS, skillSelectCategory, {
	columns: 2,
	textFunc: (ctx: any, key) => ctx.wd.r(`skill.${key}`).label()
})

menu.urlButton(
	buttonText(emoji.wikidataItem, 'menu.wikidataItem'),
	(ctx: any) => ctx.wd.r('menu.skill').url()
)

export default menu
