import {Shop} from '../types/shop'
import {TalentName, Person} from '../types/people'

import {PURCHASING_FACTOR} from './constants'

export function personalBonus(shop: Shop, talent: TalentName): number {
	const person = shop.personal[talent]
	return personalBonusWhenEmployed(shop, talent, person)
}

export function personalBonusWhenEmployed(shop: Shop, talent: TalentName, person?: Person): number {
	if (!person) {
		return 1
	}

	const talentFactor = person.talents[talent]

	const isHobby = shop.id === person.hobby
	const hobbyFactor = isHobby ? 2.5 : 1

	return talentFactor * hobbyFactor
}

export function incomeFactor(shop: Shop): number {
	return (personalBonus(shop, 'selling') * personalBonus(shop, 'purchasing')) / PURCHASING_FACTOR
}
