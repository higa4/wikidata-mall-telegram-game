import {Product, Shop} from '../types/shop'
import {Skills} from '../types/skills'

import {PURCHASING_FACTOR} from './constants'

import {collectorTotalLevel} from './skill'
import {personalBonus} from './personal'

export function purchasingCost(shop: Shop, product: Product, skills: Skills): number {
	const personal = personalBonus(shop, 'purchasing')
	return productBasePrice(product, skills) * (PURCHASING_FACTOR / personal)
}

export function sellingCost(shop: Shop, product: Product, skills: Skills): number {
	const personal = personalBonus(shop, 'selling')
	return productBasePrice(product, skills) * personal
}

export function productBasePrice(product: Product, skills: Skills): number {
	const base = Number(product.id[1]) * 2
	const collectorFactor = productBasePriceCollectorFactor(skills)
	return base * collectorFactor
}

export function productBasePriceCollectorFactor(skills: Skills): number {
	const collectorLevel = collectorTotalLevel(skills)
	return 1 + (collectorLevel * 0.1)
}
