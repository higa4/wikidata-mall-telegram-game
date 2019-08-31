import test from 'ava'

import {
	customerInterval,
	customerPerMinute,
	lastTimeActive,
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

test('lastTimeActive empty', t => {
	const result = lastTimeActive([])
	t.is(result, -Infinity)
})

test('lastTimeActive single shop', t => {
	const result = lastTimeActive([
		generateShop([1, 10])
	])
	t.is(result, 300)
})

test('lastTimeActive two shops', t => {
	const result = lastTimeActive([
		generateShop([1, 10]),
		generateShop([5])
	])
	t.is(result, 300)
})
