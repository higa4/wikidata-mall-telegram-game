import {Product, Shop} from '../types/shop'

import {PURCHASING_FACTOR} from './constants'

import {personalBonus} from './personal'

export function purchasingCost(shop: Shop, product: Product): number {
	const personal = personalBonus(shop, 'purchasing')
	return productBasePrice(product) * (PURCHASING_FACTOR / personal)
}

export function sellingCost(shop: Shop, product: Product): number {
	const personal = personalBonus(shop, 'selling')
	return productBasePrice(product) * personal
}

function productBasePrice(product: Product): number {
	return Number(product.id[1]) * 2
}

