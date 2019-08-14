import test from 'ava'

import {
	customerInterval,
	customerPerMinute,
	shopProductsEmptyTimestamps
} from '../../source/lib/game-math/shop-time'

import {generateShop} from './_shop'

test('customerInterval', t => {
	t.is(customerInterval(), 30)
})

test('customerPerMinute', t => {
	t.is(customerPerMinute(), 2)
})

test('shopProductsEmptyTimestamps', t => {
	const amounts = [0, 1, 10]
	const shop = generateShop(amounts)
	t.deepEqual(shopProductsEmptyTimestamps(shop), [
		0,
		30,
		300
	])
})

