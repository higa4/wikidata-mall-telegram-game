import test, {ExecutionContext} from 'ava'

import {Shop, Product} from '../../source/lib/types/shop'
import {Skills} from '../../source/lib/types/skills'

import {PURCHASING_FACTOR} from '../../source/lib/game-math/constants'

import {costForAdditionalShop, addProductToShopCost, moneyForShopClosure, buyAllCostFactor, buyAllCost, totalCostOfShopWithProducts} from '../../source/lib/game-math/shop'
import {productBasePrice} from '../../source/lib/game-math/product'

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

function closureIsNotProfitableMacro(t: ExecutionContext, shopsAtStart: number, products: number): void {
	const totalCost = totalCostOfShopWithProducts(shopsAtStart, products)

	const closureMoney = moneyForShopClosure(shopsAtStart + 1, products, true)
	t.log(totalCost, closureMoney, closureMoney / totalCost)
	t.true(totalCost > closureMoney)
}

for (let shops = 1; shops <= 10; shops += 3) {
	for (let products = 0; products < 10; products++) {
		test(`shop closure is not profitable having ${shops} shop, buying ${products} products`, closureIsNotProfitableMacro, shops, products)
	}
}

test('shop closure for insane players is not profitable', closureIsNotProfitableMacro, 12, 30)

function buyAllCostFactorMacro(t: ExecutionContext, magnetismLevel: number, expected: number): void {
	const skills: Skills = {magnetism: magnetismLevel}
	t.is(buyAllCostFactor(skills), expected)
}

test('buyAllCostFactor 0', buyAllCostFactorMacro, 0, 1.5)
test('buyAllCostFactor 5', buyAllCostFactorMacro, 5, 1.4)
test('buyAllCostFactor 10', buyAllCostFactorMacro, 10, 1.3)

function buyAllCostMacro(t: ExecutionContext, amounts: number[], expectedItemsToPayFor: number): void {
	const skills: Skills = {magnetism: 0}

	const costFactor = buyAllCostFactor(skills)
	t.is(costFactor, 1.5, 'sanity check')

	const basePrice = productBasePrice({id: 'Q42', itemTimestamp: 0, itemsInStore: 0}, skills)
	t.is(basePrice, 8, 'sanity check')
	const expectedCostForItemsAlone = basePrice * expectedItemsToPayFor
	const expectedCost = expectedCostForItemsAlone * costFactor * PURCHASING_FACTOR

	const products: Product[] = amounts.map(o => ({id: 'Q42', itemTimestamp: 0, itemsInStore: o}))
	const shop: Shop = {
		id: 'Q5',
		opening: 0,
		personal: {},
		products
	}

	t.is(buyAllCost(shop, skills), expectedCost)
}

test('buyAllCost no products', buyAllCostMacro, [], 0)
test('buyAllCost single product full', buyAllCostMacro, [100], 0)
test('buyAllCost single product one missing', buyAllCostMacro, [99], 1)
test('buyAllCost two product each one missing', buyAllCostMacro, [99, 99], 2)
test('buyAllCost two product empty', buyAllCostMacro, [0, 0], 200)
