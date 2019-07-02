import TelegrafInlineMenu from 'telegraf-inline-menu'

import {Session} from '../lib/types'

import {infoHeader} from '../lib/interface/formatted-strings'
import {menuPhoto} from '../lib/interface/menu'
import emojis from '../lib/interface/emojis'

import applicantMenu from './applicant'

function menuText(ctx: any): string {
	let text = ''
	text += infoHeader(ctx.wd.r('menu.applicant'))
	text += '\n\n'

	text += `+1${emojis.person} / ${60} sec`

	return text
}

const menu = new TelegrafInlineMenu(menuText, {
	photo: menuPhoto('menu.applicant')
})

function userShops(ctx: any): string[] {
	return Object.keys(ctx.session.applicants)
}

menu.selectSubmenu('a', userShops, applicantMenu, {
	columns: 2,
	textFunc: (ctx: any, key) => {
		const session = ctx.session as Session
		const {name} = session.applicants[Number(key)]
		return `${name.given} ${name.family}`
	}
})

export default menu
