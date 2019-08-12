import {Shop} from '../types/shop'
import {Skills} from '../types/skills'

import {currentLevel} from './skill'
import {personalBonus} from './personal'
import {purchasingCost} from './product'

export function costForAdditionalShop(existingShops: number): number {
	return 10 ** (existingShops + 2)
}

export function addProductToShopCost(indexOfShop: number, existingProducts: number): number {
	return costForAdditionalShop(indexOfShop) * existingProducts
}

export function totalCostOfShopWithProducts(shopsBefore: number, productsToAdd: number): number {
	const buildCost = costForAdditionalShop(shopsBefore)
	let totalCost = buildCost
	for (let i = 0; i < productsToAdd; i++) {
		totalCost += addProductToShopCost(shopsBefore, i)
	}

	return totalCost
}

export function moneyForShopClosure(existingShops: number, productsInShop: number, shopIsBuildableUnderCurrentConditions: boolean): number {
	const lastBuildCost = costForAdditionalShop(existingShops - 1)
	const factor = shopIsBuildableUnderCurrentConditions ? 0.5 : 1
	const productsInShopBonus = 1 + (Math.max(0, productsInShop - 1) * 0.4)
	return Math.ceil(factor * lastBuildCost * productsInShopBonus)
}

export function storageCapacity(shop: Shop, skills: Skills): number {
	const personal = personalBonus(shop, 'storage')
	const pressLevel = currentLevel(skills, 'machinePress')
	const press = storageCapactiyPressBonus(pressLevel)
	return Math.round(100 * personal * press)
}

export function storageCapactiyPressBonus(pressLevel: number): number {
	return 1 + (pressLevel * 0.05)
}

/**
 * Returns the interval in seconds between two customers in a given shop
 */
export function customerInterval(): number {
	return 30
}

export function buyAllCostFactor(skills: Skills, shopsToBuyIn: number): number {
	const magnetismLevel = currentLevel(skills, 'magnetism')
	// This would require someone to have magnetism level 25 for factor 1 -> Fib 25 alone is 75025 which equals 8.5 Years
	const reductionByLevel = magnetismLevel * 0.02
	const base = shopsToBuyIn > 1 ? 2.5 : 1.5
	return base - reductionByLevel
}

export function buyAllCost(shops: readonly Shop[], skills: Skills): number {
	const factor = buyAllCostFactor(skills, shops.length)
	const cost = shops
		.map(o => shopTotalPurchaseCost(o, skills))
		.reduce((a, b) => a + b, 0)

	return cost * factor
}

export function shopTotalPurchaseCost(shop: Shop, skills: Skills): number {
	const storage = storageCapacity(shop, skills)
	const cost = shop.products
		.map(product => {
			const oneCost = purchasingCost(shop, product, skills)
			const amount = storage - product.itemsInStore
			return oneCost * amount
		})
		.reduce((a, b) => a + b, 0)

	return cost
}

export function shopProductsEmptyTimestamps(shop: Shop): readonly number[] {
	const interval = customerInterval()

	const emptyTimestamps = shop.products.map(p =>
		p.itemTimestamp + (interval * p.itemsInStore)
	)

	return emptyTimestamps
}

export function shopProductsPossible(logisticsLevel: number): number {
	return 2 + logisticsLevel
}
