import TelegrafInlineMenu from 'telegraf-inline-menu'

import {buttonText} from '../lib/interface/menu'
import {infoHeader, labeledFloat} from '../lib/interface/formatted-strings'
import emoji from '../lib/interface/emojis'

import applicants from './applicants'
import languages from './languages'
import shops from './shops'

function menuText(ctx: any): string {
	let text = ''
	text += infoHeader(ctx.wd.r('menu.menu'))
	text += '\n\n'

	text += labeledFloat(ctx.wd.r('other.money'), ctx.session.money, emoji.currency)

	return text
}

const menu = new TelegrafInlineMenu(menuText)
menu.setCommand('start')

menu.submenu(buttonText(emoji.shop, 'menu.shop'), 'shops', shops)

menu.simpleButton(buttonText(emoji.mall, 'menu.mall'), 'mall', {
	doFunc: async ctx => ctx.answerCbQuery('soon…')
})

function applicantEmoji(ctx: any): string {
	return ctx.session.applicants.length > 0 ? emoji.applicantsAvailable : emoji.applicantsEmpty
}

menu.submenu(buttonText(applicantEmoji, 'menu.applicant'), 'applicants', applicants, {
	hide: (ctx: any) => ctx.session.shops.length === 0
})

menu.submenu(buttonText(emoji.language, 'menu.language'), 'lang', languages)

menu.urlButton(buttonText(emoji.chat, 'menu.chat'), 'https://t.me/Bs1thApril')

export default menu
