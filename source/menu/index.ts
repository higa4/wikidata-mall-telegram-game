import TelegrafInlineMenu from 'telegraf-inline-menu'

import {buttonText} from '../lib/interface/button'
import {infoHeader} from '../lib/interface/info-header'
import emoji from '../lib/interface/emojis'

import languages from './languages'
import shops from './shops'

function menuText(ctx: any): string {
	let text = ''
	text += infoHeader(ctx.wd.r('menu.menu'))
	text += '\n\n'

	text += 'content'

	return text
}

const menu = new TelegrafInlineMenu(menuText)
menu.setCommand('start')

menu.submenu(buttonText(emoji.shop, 'menu.shop'), 'shops', shops)

menu.simpleButton(buttonText(emoji.mall, 'menu.mall'), 'mall', {
	doFunc: ctx => ctx.answerCbQuery('soon…')
})

menu.submenu(buttonText(emoji.language, 'menu.language'), 'lang', languages)

menu.urlButton(buttonText(emoji.chat, 'menu.chat'), 'https://t.me/Bs1thApril')

export default menu
