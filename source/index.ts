import {readFileSync} from 'fs'

import Telegraf from 'telegraf'
import TelegrafI18n from 'telegraf-i18n'
import TelegrafWikibase from 'telegraf-wikibase'
import WikidataEntityStore from 'wikidata-entity-store'

import {preload} from './lib/wikidata'
import * as userSessions from './lib/data/user-sessions'
import menu from './menu'

const tokenFilePath = process.env.NODE_ENV === 'production' ? process.env.npm_package_config_tokenpath as string : 'token.txt'
const token = readFileSync(tokenFilePath, 'utf8').trim()
const bot = new Telegraf(token)

bot.use(userSessions.middleware())

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

preload(wdEntityStore)

bot.use(menu.init({
	backButtonText: (ctx: any) => `🔙 ${ctx.i18n.t('menu.back')}`,
	mainMenuButtonText: (ctx: any) => `🔝 ${ctx.wd.r('menu.menu').label()}`
}))

bot.catch((error: any) => {
	console.error('telegraf error occured', error)
})

bot.startPolling()
