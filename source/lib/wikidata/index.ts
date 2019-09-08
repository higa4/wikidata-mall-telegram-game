import {readFileSync} from 'fs'

import WikidataEntityStore from 'wikidata-entity-store'

import * as name from './name'
import * as sets from './sets'
import * as shops from './shops'
import * as inUseItems from './preload-in-use-items'

export async function preload(store: WikidataEntityStore): Promise<void> {
	console.time('wikidata preload')

	await preloadSpecific('resourceKeys', async () => store.addResourceKeyYaml(
		readFileSync('wikidata-items.yaml', 'utf8')
	))
	await preloadSpecific('name', async () => name.preload())
	await preloadSpecific('sets', async () => sets.preload(store))
	await preloadSpecific('shops', async () => shops.preload(store))

	// Load them last to see how much is missing
	await preloadSpecific('in-use-items', async () => inUseItems.preload(store))

	console.timeEnd('wikidata preload')
}

export async function update(store: WikidataEntityStore): Promise<void> {
	console.time('wikidata preload')

	try {
		await preloadSpecific('sets', async () => sets.preload(store))
		await preloadSpecific('shops', async () => shops.preload(store))
	} catch (_) {
		// Ignore update error. It is logged anyway and the game can run without the update working
	}

	console.timeEnd('wikidata preload')
}

async function preloadSpecific(title: string, loadFunc: () => Promise<void>): Promise<void> {
	try {
		console.timeLog('wikidata preload', 'start', title)
		await loadFunc()
		console.timeLog('wikidata preload', 'finish', title)
	} catch (error) {
		console.error('wikidata preloadSpecific', title, 'failed:', error)
		throw new Error(`wikidata preload ${title} failed`)
	}
}
