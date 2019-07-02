import {Product} from '../types/shop'
import {TalentName} from '../types/people'

export function storageCapacity(product: Product): number {
	const personal = personalBonus(product, 'storage')
	return Math.round(100 * personal)
}

function personalBonus(product: Product, talent: TalentName): number {
	const person = product.personal[talent]
	if (!person) {
		return 1
	}

	const talentFactor = person.talents[talent]

	const isHobby = product.id === person.hobby
	const hobbyFactor = isHobby ? 5 : 1

	return talentFactor * hobbyFactor
}
