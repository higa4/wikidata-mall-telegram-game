import {Session} from '../types'
import {Shop, Product} from '../types/shop'
import {TalentName} from '../types/people'

export default function calcPersonal(session: Session, now: number): void {
	retirePersonal(session, now)
}

function retirePersonal(session: Session, now: number): void {
	for (const shop of session.shops) {
		retireShopPersonal(shop, now)
	}
}

function retireShopPersonal(shop: Shop, now: number): void {
	for (const p of shop.products) {
		retireProductPersonal(p, now)
	}
}

function retireProductPersonal(product: Product, now: number): void {
	const takenSpots = Object.keys(product.personal) as TalentName[]

	for (const talent of takenSpots) {
		const person = product.personal[talent]
		const retire = !person || person.retirementTimestamp < now
		if (retire) {
			delete product.personal[talent]
		}
	}
}
