import WikidataEntityStore from 'wikidata-entity-store'
import {sparqlQuerySimplifiedMinified} from 'wikidata-sdk-got'
import arrayFilterUnique from 'array-filter-unique'

import {stagedAsync} from '../js-helper/async'

type Dictionary<T> = {[key: string]: T}

const toplevelShopCategories: string[] = [
	'Q11410', // Game
	'Q11460', // Clothing
	'Q2095', // Food
	'Q210729', // Electrical element
	'Q2294986', // Smart object
	'Q34379', // Musical instrument
	'Q5082128', // Mobile device
	'Q768186', // Sports Equipment
	'Q987767' // Container
]

const shopsWithProducts: Dictionary<string[]> = {}

function shopTypesQuery(topmost: string): string {
	return `SELECT ?class WHERE {
?class wdt:P279+ wd:${topmost}.
?item wdt:P31 ?class.
FILTER(EXISTS { ?class wdt:P18 ?image. })
FILTER(EXISTS { ?item wdt:P18 ?image. })
?item rdfs:label ?label.
FILTER(LANG(?label) = "en")
}
GROUP BY ?class
HAVING ((COUNT(?item)) >= 5 )`
}

function productsQuery(shopType: string): string {
	return `SELECT ?item WHERE {
?item wdt:P31 wd:${shopType}.
FILTER(EXISTS { ?item wdt:P18 ?image. })
?item rdfs:label ?label.
FILTER(LANG(?label) = "en")
}`
}

export async function preload(store: WikidataEntityStore): Promise<void> {
	console.time('wikidata-shops')

	const shopTypesArr = await stagedAsync(
		sparqlQuerySimplifiedMinified,
		toplevelShopCategories.map(o => shopTypesQuery(o))
	) as string[]

	const shopTypes = shopTypesArr
		.filter(arrayFilterUnique())

	console.timeLog('wikidata-shops', 'shopTypes', shopTypes.length)

	const products = await stagedAsync(
		loadProducts,
		shopTypes
	)

	console.timeLog('wikidata-shops', 'products', products.length)
	await store.preloadQNumbers(...[
		...shopTypes,
		...products
	])
	console.timeEnd('wikidata-shops')
}

async function loadProducts(shopType: string): Promise<string[]> {
	const products = await sparqlQuerySimplifiedMinified(productsQuery(shopType)) as string[]
	shopsWithProducts[shopType] = products
	return products
}

export function allShops(): readonly string[] {
	return Object.keys(shopsWithProducts)
}

export function products(shop: string): readonly string[] | undefined {
	return shopsWithProducts[shop]
}
