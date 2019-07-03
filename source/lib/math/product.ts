import {Product, Shop} from '../types/shop'
import {TalentName} from '../types/people'

export function purchasingCost(shop: Shop, product: Product): number {
	const personal = personalBonus(shop, product, 'purchasing')
	return 8 / personal
}

export function sellingCost(shop: Shop, product: Product): number {
	const personal = personalBonus(shop, product, 'selling')
	return 8 * personal
}

export function storageCapacity(shop: Shop, product: Product): number {
	const personal = personalBonus(shop, product, 'storage')
	return Math.round(100 * personal)
}

export function personalBonus(shop: Shop, product: Product, talent: TalentName): number {
	const person = product.personal[talent]
	if (!person) {
		return 1
	}

	const talentFactor = person.talents[talent]

	const isHobby = shop.id === person.hobby
	const hobbyFactor = isHobby ? 5 : 1

	return talentFactor * hobbyFactor
}
