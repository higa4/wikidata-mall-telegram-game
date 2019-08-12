import {Shop} from '../types/shop'

/**
 * Returns the interval in seconds between two customers in a given shop
 */
export function customerInterval(): number {
	return 30
}

export function customerPerMinute(): number {
	return 60 / customerInterval()
}

export function shopProductsEmptyTimestamps(shop: Shop): readonly number[] {
	const interval = customerInterval()

	const emptyTimestamps = shop.products.map(p =>
		p.itemTimestamp + (interval * p.itemsInStore)
	)

	return emptyTimestamps
}
