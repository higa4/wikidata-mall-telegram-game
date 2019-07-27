import arrayFilterUnique from 'array-filter-unique'
import WikidataEntityStore from 'wikidata-entity-store'

import {getAllShops} from '../data/shops'

export async function preload(wdItemStore: WikidataEntityStore): Promise<void> {
	console.time('wikidata-preload-in-use-items')
	const shops = await getAllShops()

	const shopIds = shops
		.map(o => o.id)
		.filter(arrayFilterUnique())
	console.timeLog('wikidata-preload-in-use-items', 'shops', shopIds.length)

	const products = shops.flatMap(o => o.products)
	const productIds = products
		.map(o => o.id)
		.filter(arrayFilterUnique())
	console.timeLog('wikidata-preload-in-use-items', 'products', productIds.length)

	const ids = [
		...shopIds,
		...productIds
	].filter(arrayFilterUnique())
	console.timeLog('wikidata-preload-in-use-items', 'ids', ids.length)

	const availableEntities = wdItemStore.availableEntities()
	const unknownIds = ids.filter(o => !availableEntities.includes(o))
	console.timeLog('wikidata-preload-in-use-items', 'unknown ids', unknownIds.length)

	await wdItemStore.preloadQNumbers(...unknownIds)
	console.timeEnd('wikidata-preload-in-use-items')
}
