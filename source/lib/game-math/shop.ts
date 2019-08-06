import {Shop} from '../types/shop'
import {Skills} from '../types/skills'

import {distanceDiversity} from '../math/distance'

import {currentLevel} from './skill'
import {personalBonus} from './personal'
import {productBasePrice, purchasingCost} from './product'

export function costForAdditionalShop(existingShops: number): number {
	return 10 ** (existingShops + 2)
}

export function addProductToShopCost(indexOfShop: number, existingProducts: number): number {
	return costForAdditionalShop(indexOfShop) * existingProducts
}

export function moneyForShopClosure(existingShops: number, productsInShop: number, shopIsBuildableUnderCurrentConditions: boolean): number {
	const lastBuildCost = costForAdditionalShop(existingShops - 1)
	const lastProductAddCost = costForAdditionalProduct(existingShops, Math.max(0, productsInShop - 1))
	const factor = shopIsBuildableUnderCurrentConditions ? 0.5 : 1
	return Math.ceil(factor * (lastBuildCost + lastProductAddCost))
}

export function storageCapacity(shop: Shop, skills: Skills): number {
	const personal = personalBonus(shop, 'storage')
	const pressLevel = currentLevel(skills, 'machinePress', shop.id)
	const press = storageCapactiyPressBonus(pressLevel)
	return Math.round(100 * personal * press)
}

export function storageCapactiyPressBonus(pressLevel: number): number {
	return 1 + (pressLevel * 0.1)
}

export function shopDiversificationFactor(shop: Shop): number {
	const basePrices = shop.products
		.map(p => productBasePrice(p, {}))

	const diversity = distanceDiversity(basePrices)

	// From 0 to 1 -> 0.75 to 1.25
	return (diversity / 2) + 0.75
}

/**
 * Returns the interval in seconds between two customers in a given shop
 */
export function customerInterval(shop: Shop): number {
	const diversityFactor = shopDiversificationFactor(shop)

	const factor = diversityFactor
	return 30 / factor
}

export function buyAllCostFactor(skills: Skills): number {
	const magnetismLevel = currentLevel(skills, 'magnetism')
	// This would require someone to have magnetism level 25 for factor 1 -> Fib 25 alone is 75025 which equals 8.5 Years
	return 1.5 - (0.02 * magnetismLevel)
}

export function buyAllCost(shop: Shop, skills: Skills): number {
	const storage = storageCapacity(shop, skills)
	const factor = buyAllCostFactor(skills)
	const cost = shop.products
		.map(product => {
			const oneCost = purchasingCost(shop, product, skills)
			const amount = storage - product.itemsInStore
			return oneCost * amount
		})
		.reduce((a, b) => a + b, 0)

	return cost * factor
}

export function shopProductsEmptyTimestamps(shop: Shop): readonly number[] {
	const interval = customerInterval(shop)

	const emptyTimestamps = shop.products.map(p =>
		p.itemTimestamp + (interval * p.itemsInStore)
	)

	return emptyTimestamps
}

export function shopProductsPossible(logisticsLevel: number): number {
	return 2 + logisticsLevel
}
