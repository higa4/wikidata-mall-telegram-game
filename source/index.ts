import {readFileSync} from 'fs'

import Telegraf from 'telegraf'
import TelegrafI18n from 'telegraf-i18n'
import TelegrafWikibase from 'telegraf-wikibase'
import WikidataEntityStore from 'wikidata-entity-store'

import * as userSessions from './lib/data/user-sessions'
import * as wdSets from './lib/wikidata/sets'
import * as wdShops from './lib/wikidata/shops'
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

preload()
async function preload(): Promise<void> {
	console.time('preload wikidata entity store')

	await preloadSpecific('middleware', () => wdEntityStore.addResourceKeyYaml(
		readFileSync('wikidata-items.yaml', 'utf8')
	))
	await preloadSpecific('sets', () => wdSets.preload(wdEntityStore))
	await preloadSpecific('shops', () => wdShops.preload(wdEntityStore))

	console.timeEnd('preload wikidata entity store')
}

async function preloadSpecific(title: string, loadFunc: () => Promise<void>): Promise<void> {
	try {
		await loadFunc()
		console.timeLog('preload wikidata entity store', title)
	} catch (e) {
		console.error('preload wikidata entity store failed', title, e)
	}
}

bot.use(menu.init({
	backButtonText: (ctx: any) => `🔙 ${ctx.i18n.t('menu.back')}`,
	mainMenuButtonText: (ctx: any) => `🔝 ${ctx.wd.r('menu.menu').label()}`
}))

bot.catch((error: any) => {
	console.error('telegraf error occured', error)
})

bot.startPolling()
