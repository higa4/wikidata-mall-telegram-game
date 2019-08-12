import test, {ExecutionContext} from 'ava'

import {Shop, Product} from '../../source/lib/types/shop'
import {Skills} from '../../source/lib/types/skills'

import {PURCHASING_FACTOR} from '../../source/lib/game-math/constants'

import {productBasePrice} from '../../source/lib/game-math/product'
import {
	addProductToShopCost,
	buyAllCost,
	buyAllCostFactor,
	costForAdditionalShop,
	moneyForShopClosure,
	returnOfInvest,
	sellPerMinute,
	shopTotalPurchaseCost,
	totalCostOfShopWithProducts
} from '../../source/lib/game-math/shop-cost'

function costForAdditionalShopMacro(t: ExecutionContext, existingShops: number, expectedCost: number): void {
	t.is(costForAdditionalShop(existingShops), expectedCost)
}

test('costForAdditionalShop 0 shops', costForAdditionalShopMacro, 0, 100)
test('costForAdditionalShop 1 shops', costForAdditionalShopMacro, 1, 1000)
test('costForAdditionalShop 2 shops', costForAdditionalShopMacro, 2, 10000)
test('costForAdditionalShop 3 shops', costForAdditionalShopMacro, 3, 100000)

function addProductToShopCostMacro(t: ExecutionContext, existingShops: number, existingProducts: number, expectedCost: number): void {
	t.is(addProductToShopCost(existingShops, existingProducts), expectedCost)
}

test('addProductToShopCost first shop 0 products', addProductToShopCostMacro, 0, 0, 0)
test('addProductToShopCost second shop 0 products', addProductToShopCostMacro, 1, 0, 0)
test('addProductToShopCost third shop 0 products', addProductToShopCostMacro, 2, 0, 0)

test('addProductToShopCost first shop 1 products', addProductToShopCostMacro, 0, 1, 100)
test('addProductToShopCost second shop 1 products', addProductToShopCostMacro, 1, 1, 1000)
test('addProductToShopCost third shop 1 products', addProductToShopCostMacro, 2, 1, 10000)

test('addProductToShopCost first shop 4 products', addProductToShopCostMacro, 0, 4, 400)
test('addProductToShopCost second shop 4 products', addProductToShopCostMacro, 1, 4, 4000)
test('addProductToShopCost third shop 4 products', addProductToShopCostMacro, 2, 4, 40000)

function totalCostOfShopWithProductsMacro(t: ExecutionContext, shopsBefore: number, products: number, expectedCost: number): void {
	t.is(totalCostOfShopWithProducts(shopsBefore, products), expectedCost)
}

test('totalCostOfShopWithProducts 0 shops, 0 products', totalCostOfShopWithProductsMacro, 0, 0, 100)
test('totalCostOfShopWithProducts 1 shops, 0 products', totalCostOfShopWithProductsMacro, 1, 0, 1000)
test('totalCostOfShopWithProducts 2 shops, 0 products', totalCostOfShopWithProductsMacro, 2, 0, 10000)

test('totalCostOfShopWithProducts 0 shops, 1 products', totalCostOfShopWithProductsMacro, 0, 1, 100)
test('totalCostOfShopWithProducts 1 shops, 1 products', totalCostOfShopWithProductsMacro, 1, 1, 1000)
test('totalCostOfShopWithProducts 2 shops, 1 products', totalCostOfShopWithProductsMacro, 2, 1, 10000)

test('totalCostOfShopWithProducts 0 shops, 2 products', totalCostOfShopWithProductsMacro, 0, 2, 200)
test('totalCostOfShopWithProducts 1 shops, 2 products', totalCostOfShopWithProductsMacro, 1, 2, 2000)
test('totalCostOfShopWithProducts 2 shops, 2 products', totalCostOfShopWithProductsMacro, 2, 2, 20000)

test('totalCostOfShopWithProducts 0 shops, 3 products', totalCostOfShopWithProductsMacro, 0, 3, 400)
test('totalCostOfShopWithProducts 1 shops, 3 products', totalCostOfShopWithProductsMacro, 1, 3, 4000)
test('totalCostOfShopWithProducts 2 shops, 3 products', totalCostOfShopWithProductsMacro, 2, 3, 40000)

function buyShopForClosureIsNotProfitableMacro(t: ExecutionContext, shopsAtStart: number, products: number): void {
	const totalCost = totalCostOfShopWithProducts(shopsAtStart, products)

	const closureMoney = moneyForShopClosure(shopsAtStart + 1, products, true)
	t.log(totalCost, closureMoney, closureMoney / totalCost)
	t.true(totalCost > closureMoney)
}

for (let shops = 1; shops <= 10; shops += 3) {
	for (let products = 0; products <= 10; products++) {
		test(`buy shop for closure is not profitable having ${shops} shop, buying ${products} products`, buyShopForClosureIsNotProfitableMacro, shops, products)
	}
}

test('buy shop for closure for insane players is not profitable', buyShopForClosureIsNotProfitableMacro, 12, 30)

function closureBringsNotMoreMoneyThenNewShopBuildCosts(t: ExecutionContext, currentShops: number, products: number): void {
	const buildCost = costForAdditionalShop(currentShops - 1)
	const closureMoney = moneyForShopClosure(currentShops, products, true)
	t.log(buildCost, closureMoney)
	t.true(buildCost * 3 > closureMoney, 'closure should not bring much more money than building a shop')
}

for (let shops = 1; shops <= 10; shops += 3) {
	for (let products = 0; products <= 10; products++) {
		test(`closure brings not more money then new shop build cost having ${shops} shop, buying ${products} products`, closureBringsNotMoreMoneyThenNewShopBuildCosts, shops, products)
	}
}

function buyAllCostFactorMacro(t: ExecutionContext, magnetismLevel: number, shops: number, expected: number): void {
	const skills: Skills = {magnetism: magnetismLevel}
	t.is(buyAllCostFactor(skills, shops), expected)
}

test('buyAllCostFactor 0 in single shop', buyAllCostFactorMacro, 0, 1, 1.5)
test('buyAllCostFactor 5 in single shop', buyAllCostFactorMacro, 5, 1, 1.4)
test('buyAllCostFactor 10 in single shop', buyAllCostFactorMacro, 10, 1, 1.3)

test('buyAllCostFactor 0 in multiple shops', buyAllCostFactorMacro, 0, 3, 2.5)
test('buyAllCostFactor 5 in multiple shops', buyAllCostFactorMacro, 5, 3, 2.4)
test('buyAllCostFactor 10 in multiple shops', buyAllCostFactorMacro, 10, 3, 2.3)

function shopTotalPurchaseCostMacro(t: ExecutionContext, amounts: number[], expectedItemsToPayFor: number): void {
	const skills: Skills = {magnetism: 0}

	const basePrice = productBasePrice({id: 'Q42', itemTimestamp: 0, itemsInStore: 0}, skills)
	t.is(basePrice, 8, 'sanity check')
	const expectedCostForItemsAlone = basePrice * expectedItemsToPayFor
	const expectedCost = expectedCostForItemsAlone * PURCHASING_FACTOR

	const products: Product[] = amounts.map(o => ({id: 'Q42', itemTimestamp: 0, itemsInStore: o}))
	const shop: Shop = {
		id: 'Q5',
		opening: 0,
		personal: {},
		products
	}

	t.is(shopTotalPurchaseCost(shop, skills), expectedCost)
}

test('shopTotalPurchaseCost no products', shopTotalPurchaseCostMacro, [], 0)
test('shopTotalPurchaseCost single product full', shopTotalPurchaseCostMacro, [100], 0)
test('shopTotalPurchaseCost single product one missing', shopTotalPurchaseCostMacro, [99], 1)
test('shopTotalPurchaseCost two product each one missing', shopTotalPurchaseCostMacro, [99, 99], 2)
test('shopTotalPurchaseCost two product empty', shopTotalPurchaseCostMacro, [0, 0], 200)

test('buyAllCost', t => {
	const skills: Skills = {magnetism: 0}
	const shops: Shop[] = [{
		id: 'Q5',
		opening: 0,
		personal: {},
		products: [{
			id: 'Q42',
			itemTimestamp: 0,
			itemsInStore: 99
		}]
	}, {
		id: 'Q5',
		opening: 0,
		personal: {},
		products: [{
			id: 'Q42',
			itemTimestamp: 0,
			itemsInStore: 99
		}, {
			id: 'Q42',
			itemTimestamp: 0,
			itemsInStore: 99
		}]
	}]

	const expectedItemsToPayFor = 3

	const basePrice = productBasePrice({id: 'Q42', itemTimestamp: 0, itemsInStore: 0}, skills)
	t.is(basePrice, 8, 'sanity check')

	const costFactor = buyAllCostFactor(skills, shops.length)
	t.is(costFactor, 2.5, 'sanity check')

	const expectedCostForItemsAlone = basePrice * expectedItemsToPayFor
	const expectedCost = expectedCostForItemsAlone * costFactor * PURCHASING_FACTOR

	t.is(Math.round(buyAllCost(shops, skills)), Math.round(expectedCost))
})

test('returnOfInvest without skills or personal', t => {
	const skills: Skills = {}
	const shop: Shop = {
		id: 'Q5',
		opening: 0,
		personal: {},
		products: [{
			id: 'Q42',
			itemTimestamp: 0,
			itemsInStore: 0
		}]
	}

	t.is(returnOfInvest([shop], skills), 1 / PURCHASING_FACTOR)
})

test('returnOfInvest without skills or personal and magnet', t => {
	const skills: Skills = {}
	const shop: Shop = {
		id: 'Q5',
		opening: 0,
		personal: {},
		products: [{
			id: 'Q42',
			itemTimestamp: 0,
			itemsInStore: 0
		}]
	}

	t.is(returnOfInvest([shop], skills, 1.5), 1 / (PURCHASING_FACTOR * 1.5))
})

test('returnOfInvest with personal without skills', t => {
	const skills: Skills = {}
	const shop: Shop = {
		id: 'Q5',
		opening: 0,
		personal: {
			selling: {
				hobby: 'Q2',
				name: {
					given: '',
					family: ''
				},
				retirementTimestamp: 0,
				talents: {
					purchasing: 1,
					selling: 1.5,
					storage: 1
				}
			}
		},
		products: [{
			id: 'Q42',
			itemTimestamp: 0,
			itemsInStore: 0
		}]
	}

	t.is(returnOfInvest([shop], skills), 1.5 / PURCHASING_FACTOR)
})

test('returnOfInvest without products', t => {
	const skills: Skills = {}
	const shop: Shop = {
		id: 'Q5',
		opening: 0,
		personal: {},
		products: []
	}

	t.is(returnOfInvest([shop], skills), NaN)
})

function sellPerMinuteMacro(t: ExecutionContext, amounts: number[], expected: number): void {
	const skills: Skills = {}
	const products: Product[] = amounts.map(o => ({id: 'Q42', itemTimestamp: 0, itemsInStore: o}))
	const shop: Shop = {
		id: 'Q5',
		opening: 0,
		personal: {},
		products
	}

	const basePrice = productBasePrice({id: 'Q42', itemTimestamp: 0, itemsInStore: 0}, skills)
	t.is(basePrice, 8, 'sanity check')

	t.is(sellPerMinute(shop, skills), expected)
}

test('sellPerMinute nothing', sellPerMinuteMacro, [], 0)
test('sellPerMinute 0', sellPerMinuteMacro, [0], 0)
test('sellPerMinute 0, 0', sellPerMinuteMacro, [0, 0], 0)
test('sellPerMinute 1', sellPerMinuteMacro, [1], 8 * 2)
test('sellPerMinute 1, 1', sellPerMinuteMacro, [1, 1], 8 * 2 * 2)
