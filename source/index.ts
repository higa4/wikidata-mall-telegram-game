import {existsSync, readFileSync} from 'fs'

import Telegraf, {Extra, Markup} from 'telegraf'
import TelegrafI18n from 'telegraf-i18n'
import TelegrafWikibase from 'telegraf-wikibase'
import WikidataEntityStore from 'wikidata-entity-store'

import {NotificationManager} from './lib/notification/manager'
import {notificationText} from './lib/interface/notification'
import {preload} from './lib/wikidata'
import * as dataShops from './lib/data/shops'
import * as dataSkills from './lib/data/skills'
import * as notifications from './lib/session-math/notification'
import * as userSessions from './lib/data/user-sessions'
import emojis from './lib/interface/emojis'
import menu from './menu'
import sessionMathMiddleware from './lib/session-math'

const tokenFilePath = existsSync('/run/secrets') ? '/run/secrets/bot-token.txt' : 'bot-token.txt'
const token = readFileSync(tokenFilePath, 'utf8').trim()
const bot = new Telegraf(token)

if (process.env.NODE_ENV !== 'production') {
	bot.use(async (ctx, next) => {
		const updateId = ctx.update.update_id.toString(36)
		const content = (ctx.callbackQuery && ctx.callbackQuery.data) || (ctx.message && ctx.message.text)
		const identifier = `${updateId} ${ctx.updateType} ${ctx.from!.first_name} ${content && content.length} ${content}`

		console.time(identifier)
		if (next) {
			await next()
		}

		console.timeEnd(identifier)
	})
}

bot.use(async (ctx, next) => {
	try {
		if (next) {
			await next()
		}
	} catch (error) {
		if (error.message.includes('Too Many Requests')) {
			console.warn('Telegraf Too Many Requests error. Skip.', error)
			return
		}

		if (
			error.message.includes('query is too old') ||
			error.message.includes('cancelled by new editMessageMedia request')
		) {
			console.warn('ERROR', ctx.from!.id, ctx.callbackQuery && ctx.callbackQuery.data, error.message)
			return
		}

		if (error.message.includes('MEDIA_EMPTY')) {
			console.warn('MEDIA_EMPTY', ctx.from!.id, ctx.callbackQuery && ctx.callbackQuery.data)
		} else {
			console.error('try to send error to user', ctx.update, error, error && error.on && error.on.payload)
		}

		let text = '🔥 Something went wrong here!'
		text += '\n'
		text += 'You should join the Chat Group and report this error. Let us make this bot even better together. ☺️'

		text += '\n\n'
		text += 'Error: `'
		text += error.message
			.replace(token, '')
		text += '`'

		const target = (ctx.chat || ctx.from!).id
		const keyboard = Markup.inlineKeyboard([
			Markup.urlButton(emojis.chat + 'Join Chat', 'https://t.me/WikidataMallChat')
		], {columns: 1})
		await bot.telegram.sendMessage(target, text, Extra.markdown().markup(keyboard))
	}
})

bot.use(userSessions.middleware())
bot.use(dataShops.middleware())
bot.use(dataSkills.middleware())
bot.use(sessionMathMiddleware())

const i18n = new TelegrafI18n({
	directory: 'locales',
	defaultLanguage: 'en',
	defaultLanguageOnMissing: true,
	useSession: true
})

bot.use(i18n.middleware())

const wdEntityStore = new WikidataEntityStore({
	properties: ['labels', 'descriptions', 'claims']
})

const notificationManager = new NotificationManager(
	async (chatId, notification, fireDate) => {
		try {
			const text = notificationText(notification, fireDate)
			await bot.telegram.sendMessage(chatId, text, Extra.markdown() as any)
		} catch (error) {
			console.error('notification failed to send', chatId, error)
		}
	}
)

bot.use(new TelegrafWikibase(wdEntityStore, {
	contextKey: 'wd'
}).middleware())

bot.use(menu.init({
	backButtonText: (ctx: any) => `🔙 ${ctx.i18n.t('menu.back')}`,
	mainMenuButtonText: (ctx: any) => `🔝 ${ctx.wd.r('menu.menu').label()}`
}))

bot.catch((error: any) => {
	console.error('telegraf error occured', error)
})

preload(wdEntityStore)
	.then(async () => {
		await notifications.initialize(notificationManager, wdEntityStore)
		bot.startPolling()
		console.log(new Date(), 'Bot started')
	})
	.catch(error => {
		console.error('startup failed:', error)
	})
