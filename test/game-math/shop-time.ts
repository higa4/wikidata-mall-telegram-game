import test from 'ava'

import {Product, Shop} from '../../source/lib/types/shop'

import {
	customerInterval,
	customerPerMinute,
	shopProductsEmptyTimestamps
} from '../../source/lib/game-math/shop-time'

test('customerInterval', t => {
	t.is(customerInterval(), 30)
})

test('customerPerMinute', t => {
	t.is(customerPerMinute(), 2)
})

test('shopProductsEmptyTimestamps', t => {
	const amounts = [0, 1, 10]
	const products: Product[] = amounts.map(o => ({id: 'Q42', itemTimestamp: 0, itemsInStore: o}))
	const shop: Shop = {
		id: 'Q5',
		opening: 0,
		personal: {},
		products
	}

	t.deepEqual(shopProductsEmptyTimestamps(shop), [
		0,
		30,
		300
	])
})

