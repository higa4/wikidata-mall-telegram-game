import {readFileSync} from 'fs'

import WikidataEntityStore from 'wikidata-entity-store'

import * as sets from './sets'
import * as shops from './shops'

export async function preload(store: WikidataEntityStore): Promise<void> {
	console.time('wikidata preload')

	await preloadSpecific('middleware', async () => store.addResourceKeyYaml(
		readFileSync('wikidata-items.yaml', 'utf8')
	))
	await preloadSpecific('sets', async () => sets.preload(store))
	await preloadSpecific('shops', async () => shops.preload(store))

	console.timeEnd('wikidata preload')
}

async function preloadSpecific(title: string, loadFunc: () => Promise<void>): Promise<void> {
	try {
		await loadFunc()
		console.timeLog('wikidata preload', title)
	} catch (error) {
		console.error('wikidata preload failed', title, error)
	}
}
