import {Product, Shop} from '../types/shop'
import {TalentName} from '../types/people'

export function purchasingCost(shop: Shop, product: Product): number {
	const personal = personalBonus(shop, 'purchasing')
	return productBasePrice(product) * (0.95 / personal)
}

export function sellingCost(shop: Shop, product: Product): number {
	const personal = personalBonus(shop, 'selling')
	return productBasePrice(product) * personal
}

export function storageCapacity(shop: Shop): number {
	const personal = personalBonus(shop, 'storage')
	return Math.round(100 * personal)
}

function productBasePrice(product: Product): number {
	return Number(product.id[1]) * 2
}

export function personalBonus(shop: Shop, talent: TalentName): number {
	const person = shop.personal[talent]
	if (!person) {
		return 1
	}

	const talentFactor = person.talents[talent]

	const isHobby = shop.id === person.hobby
	const hobbyFactor = isHobby ? 5 : 1

	return talentFactor * hobbyFactor
}
