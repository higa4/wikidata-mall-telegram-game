import TelegrafInlineMenu from 'telegraf-inline-menu'

import {Name} from '../lib/types/people'

import {infoHeader} from '../lib/interface/formatted-strings'
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
	photo: (ctx: any) => ctx.wd.r('menu.applicant').images(800)[0]
})

function userShops(ctx: any): string[] {
	return Object.keys(ctx.session.applicants)
}

menu.selectSubmenu('a', userShops, applicantMenu, {
	columns: 2,
	textFunc: (ctx: any, key) => {
		const name = ctx.session.applicants[key].name as Name
		return `${name.given} ${name.family}`
	}
})

export default menu
