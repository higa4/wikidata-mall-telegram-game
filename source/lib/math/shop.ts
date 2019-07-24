import {Shop} from '../types/shop'

import {personalBonus} from './personal'

export function buildCost(existingShops: number): number {
	return 10 ** (existingShops + 2)
}

export function productCost(existingShops: number, existingProducts: number): number {
	return buildCost(existingShops - 1) * existingProducts
}

export function storageCapacity(shop: Shop): number {
	const personal = personalBonus(shop, 'storage')
	return Math.round(100 * personal)
}
