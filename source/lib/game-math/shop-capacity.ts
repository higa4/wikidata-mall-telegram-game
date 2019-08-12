import {Shop} from '../types/shop'
import {Skills} from '../types/skills'

import {currentLevel} from './skill'
import {personalBonus} from './personal'

export function storageCapacity(shop: Shop, skills: Skills): number {
	const personal = personalBonus(shop, 'storage')
	const pressLevel = currentLevel(skills, 'machinePress')
	const press = storageCapactiyPressBonus(pressLevel)
	return Math.round(100 * personal * press)
}

export function storageCapactiyPressBonus(pressLevel: number): number {
	return 1 + (pressLevel * 0.05)
}

export function storageFilledPercentage(shop: Shop, skills: Skills): number {
	if (shop.products.length === 0) {
		return 0
	}

	const capacity = storageCapacity(shop, skills)
	const totalCapacity = capacity * shop.products.length
	const itemsInStore = shop.products
		.map(o => o.itemsInStore)
		.reduce((a, b) => a + b, 0)

	return itemsInStore / totalCapacity
}

export function shopProductsPossible(logisticsLevel: number): number {
	return 2 + logisticsLevel
}
