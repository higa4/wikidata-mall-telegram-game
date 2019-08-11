import TelegrafInlineMenu from 'telegraf-inline-menu'

import {Session, Persist} from '../lib/types'
import {Skills, CategorySkill, SimpleSkill, SIMPLE_SKILLS, CATEGORY_SKILLS, Skill} from '../lib/types/skills'

import {sortDictByValue} from '../lib/js-helper/dictionary'

import {currentLevel} from '../lib/game-math/skill'

import {infoHeader} from '../lib/interface/formatted-strings'
import {menuPhoto, buttonText} from '../lib/interface/menu'
import {skillInTrainingString} from '../lib/interface/skill'
import emoji from '../lib/interface/emojis'

import skillMenu from './skill'
import skillSelectCategory from './skill-select-category'

type Dictionary<T> = {[key: string]: T}

function simpleSkillPart(ctx: any, skills: Skills, skill: SimpleSkill): string {
	if (!skills[skill]) {
		return ''
	}

	let text = ''
	text += emoji[skill] || ''
	text += ctx.wd.r(`skill.${skill}`).label()
	text += ': '
	text += currentLevel(skills, skill)

	return text
}

function categorySkillPart(ctx: any, skills: Skills, skill: CategorySkill): string {
	const {__wikibase_language_code: locale} = ctx.session as Session
	if (!skills[skill]) {
		return ''
	}

	const categories = Object.keys(skills[skill]!)
	if (categories.length === 0) {
		return ''
	}

	let text = ''
	text += emoji[skill] || ''
	text += ctx.wd.r(`skill.${skill}`).label()
	text += '\n'
	text += categories
		.map(o => categorySkillPartLine(ctx, skills, skill, o))
		.sort((a, b) => a.localeCompare(b, locale))
		.map(o => `  ${o}`)
		.join('\n')

	return text
}

function categorySkillPartLine(ctx: any, skills: Skills, skill: CategorySkill, category: string): string {
	let text = ''
	text += ctx.wd.r(category).label()
	text += ': '
	text += currentLevel(skills, skill, category)
	return text
}

function menuText(ctx: any): string {
	const session = ctx.session as Session
	const persist = ctx.persist as Persist
	const {__wikibase_language_code: locale} = session

	let text = ''
	text += infoHeader(ctx.wd.r('menu.skill'), {titlePrefix: emoji.skill})
	text += '\n\n'

	const simpleSkillParts = SIMPLE_SKILLS
		.map(o => simpleSkillPart(ctx, persist.skills, o))
		.sort((a, b) => a.localeCompare(b, locale))
		.filter(o => o)

	const categorySkillParts = CATEGORY_SKILLS
		.map(o => categorySkillPart(ctx, persist.skills, o))
		.filter(o => o)

	if (simpleSkillParts.length + categorySkillParts.length > 0) {
		text += '*'
		text += ctx.wd.r('skill.level').label()
		text += '*'

		if (simpleSkillParts.length > 0) {
			text += '\n'
			text += simpleSkillParts.join('\n')
		}

		if (categorySkillParts.length > 0) {
			text += '\n\n'
			text += categorySkillParts.join('\n\n')
		}

		text += '\n\n'
	}

	if (session.skillInTraining) {
		text += skillInTrainingString(ctx, session.skillInTraining)
		text += '\n\n'
	}

	return text
}

const menu = new TelegrafInlineMenu(menuText, {
	photo: menuPhoto('menu.skill')
})

function skillOptions(ctx: any, skills: Skill[]): Dictionary<string> {
	const {__wikibase_language_code: locale} = ctx.session as Session
	const labels: Dictionary<string> = {}
	for (const key of skills) {
		labels[key] = ctx.wd.r(`skill.${key}`).label()
	}

	return sortDictByValue(labels, locale)
}

menu.selectSubmenu('simple', ctx => skillOptions(ctx, SIMPLE_SKILLS), skillMenu, {
	columns: 2,
	prefixFunc: (_, key) => emoji[key] || ''
})

menu.selectSubmenu('c', ctx => skillOptions(ctx, CATEGORY_SKILLS), skillSelectCategory, {
	columns: 2,
	prefixFunc: (_, key) => emoji[key] || ''
})

menu.urlButton(
	buttonText(emoji.wikidataItem, 'menu.wikidataItem'),
	(ctx: any) => ctx.wd.r('menu.skill').url()
)

export default menu
