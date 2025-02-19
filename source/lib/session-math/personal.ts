import {Session, Persist} from '../types'
import {Shop} from '../types/shop'
import {TalentName} from '../types/people'

export default function calcPersonal(_session: Session, persist: Persist, now: number): void {
	retirePersonal(persist, now)
}

function retirePersonal(persist: Persist, now: number): void {
	for (const shop of persist.shops) {
		retireShopPersonal(shop, now)
	}
}

function retireShopPersonal(shop: Shop, now: number): void {
	const takenSpots = Object.keys(shop.personal) as TalentName[]

	for (const talent of takenSpots) {
		const person = shop.personal[talent]
		const retire = !person || person.retirementTimestamp < now
		if (retire) {
			delete shop.personal[talent]
		}
	}
}
