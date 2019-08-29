import {User} from 'telegram-typings'
import TelegrafInlineMenu from 'telegraf-inline-menu'

import {Dictionary, sortDictByNumericValue} from '../lib/js-helper/dictionary'

import {Skills} from '../lib/types/skills'
import {Session, LeaderboardView, LEADERBOARD_VIEWS} from '../lib/types'

import * as userInfo from '../lib/data/user-info'
import * as userShops from '../lib/data/shops'
import * as userSkills from '../lib/data/skills'

import {returnOnInvestment} from '../lib/game-math/shop-cost'

import {emojis} from '../lib/interface/emojis'
import {infoHeader} from '../lib/interface/formatted-strings'
import {menuPhoto, buttonText} from '../lib/interface/menu'
import {percentBonusString} from '../lib/interface/format-percent'
import {collectorTotalLevel} from '../lib/game-math/skill'

const DEFAULT_VIEW: LeaderboardView = 'returnOnInvestment'

async function getROITable(): Promise<Dictionary<number>> {
	const allUserShops = await userShops.getAllShops()
	const allUserSkills = await userSkills.getAllSkills()
	const playerIds = Object.keys(allUserShops)

	const roiTable: Dictionary<number> = {}
	for (const playerId of playerIds) {
		const shops = allUserShops[playerId]
		const skills: Skills = allUserSkills[playerId] || {}
		const roi = returnOnInvestment(shops, skills)
		if (!isFinite(roi)) {
			continue
		}

		// This stupid javascript sorts numberic strings by number
		roiTable[`id${playerId}`] = roi
	}

	return sortDictByNumericValue(roiTable, true)
}

async function getCollectorTable(): Promise<Dictionary<number>> {
	const allUserSkills = await userSkills.getAllSkills()
	const table: Dictionary<number> = {}
	for (const playerId of Object.keys(allUserSkills)) {
		const level = collectorTotalLevel(allUserSkills[playerId])
		// This stupid javascript sorts numberic strings by number
		table[`id${playerId}`] = level
	}

	return sortDictByNumericValue(table, true)
}

function entryLine(index: number, info: User | undefined, formattedValue: string): string {
	const name = info ? info.first_name : '??'
	const rank = index + 1
	return `${rank}. ${formattedValue} *${name}*`
}

async function generateTable(entries: Dictionary<number>, forPlayerId: number, formatNumberFunc: (num: number) => string): Promise<string> {
	const allPlayerInfos = await userInfo.getAll()
	const entryIds = Object.keys(entries)
	const playerIdFromEntryIdFunc = (entryId: string): number => Number(entryId.slice(2))

	const lines = await Promise.all(
		entryIds.map((entryId, i) => {
			const playerId = playerIdFromEntryIdFunc(entryId)
			if (i < 10 || playerId === forPlayerId) {
				return entryLine(i, allPlayerInfos[playerId], formatNumberFunc(entries[entryId]))
			}

			return undefined
		})
	)

	return lines
		.filter(o => o)
		.join('\n')
}

async function menuText(ctx: any): Promise<string> {
	const session = ctx.session as Session

	let text = ''
	text += infoHeader(ctx.wd.r('menu.leaderboard'), {titlePrefix: emojis.leaderboard})
	text += '\n\n'

	const view = session.leaderboardView || DEFAULT_VIEW
	switch (view) {
		case 'returnOnInvestment':
			text += await generateTable(await getROITable(), ctx.from.id, percentBonusString)
			break

		case 'collector':
			text += await generateTable(await getCollectorTable(), ctx.from.id, o => String(o))
			break

		default:
			throw new Error('unknown leaderboard view')
	}

	return text
}

const menu = new TelegrafInlineMenu(menuText, {
	photo: menuPhoto('menu.leaderboard')
})

function viewResourceKey(view: LeaderboardView): string {
	switch (view) {
		case 'returnOnInvestment':
			return 'other.returnOnInvestment'
		case 'collector':
			return 'skill.collector'
		default:
			throw new Error('unknown leaderboard view')
	}
}

menu.select('view', LEADERBOARD_VIEWS, {
	isSetFunc: (ctx: any, key) => {
		const session = ctx.session as Session
		return session.leaderboardView === key || (key === DEFAULT_VIEW && !session.leaderboardView)
	},
	setFunc: (ctx: any, key) => {
		const session = ctx.session as Session
		session.leaderboardView = key as LeaderboardView
	},
	textFunc: (ctx: any, key) => {
		return ctx.wd.r(viewResourceKey(key as LeaderboardView)).label()
	}
})

menu.urlButton(
	buttonText(emojis.wikidataItem, 'menu.wikidataItem'),
	(ctx: any) => ctx.wd.r('menu.leaderboard').url()
)

export default menu
