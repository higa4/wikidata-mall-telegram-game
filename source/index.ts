import {existsSync, readFileSync} from 'fs'

import Telegraf from 'telegraf'
import TelegrafI18n from 'telegraf-i18n'
import TelegrafWikibase from 'telegraf-wikibase'
import WikidataEntityStore from 'wikidata-entity-store'

import {preload} from './lib/wikidata'
import * as userSessions from './lib/data/user-sessions'
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

bot.use(userSessions.middleware())
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
	.then(() => {
		bot.startPolling()
		console.log(new Date(), 'Bot started')
	})
