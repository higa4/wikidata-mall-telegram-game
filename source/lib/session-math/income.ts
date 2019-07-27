import {Session, Persist} from '../types'
import {Shop, Product} from '../types/shop'

import {customerInterval} from '../math/shop'
import {sellingCost} from '../math/product'

export default function calcIncome(session: Session, persist: Persist, now: number): void {
	for (const shop of persist.shops) {
		for (const product of shop.products) {
			incomeProduct(session, shop, product, now)
		}
	}
}

function incomeProduct(session: Session, shop: Shop, product: Product, now: number): void {
	const secondsAgo = now - product.itemTimestamp
	const sellInterval = customerInterval(shop)

	const canSell = Math.floor(secondsAgo / sellInterval)
	const sellItems = Math.min(canSell, product.itemsInStore)
	const pricePerItem = sellingCost(shop, product)

	product.itemsInStore -= sellItems
	product.itemTimestamp += sellItems * sellInterval
	session.money += pricePerItem * sellItems
}
