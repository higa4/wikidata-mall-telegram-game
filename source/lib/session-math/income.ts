import {Session} from '../types'
import {Shop, Product} from '../types/shop'

import {sellingCost} from '../math/product'

const ITEM_SELL_INTERVAL_SECONDS = 30

export default function calcIncome(session: Session, now: number): void {
	for (const shop of session.shops) {
		for (const product of shop.products) {
			incomeProduct(session, shop, product, now)
		}
	}
}

function incomeProduct(session: Session, shop: Shop, product: Product, now: number): void {
	const secondsAgo = now - product.itemTimestamp
	const canSell = Math.floor(secondsAgo / ITEM_SELL_INTERVAL_SECONDS)
	const sellItems = Math.min(canSell, product.itemsInStore)
	const pricePerItem = sellingCost(shop, product)

	product.itemsInStore -= sellItems
	product.itemTimestamp += sellItems * ITEM_SELL_INTERVAL_SECONDS
	session.money += pricePerItem * sellItems
}
