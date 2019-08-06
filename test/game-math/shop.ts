import test, {ExecutionContext} from 'ava'

import {Shop, Product} from '../../source/lib/types/shop'
import {Skills} from '../../source/lib/types/skills'

import {PURCHASING_FACTOR} from '../../source/lib/game-math/constants'

import {costForAdditionalShop, addProductToShopCost, moneyForShopClosure, buyAllCostFactor, buyAllCost} from '../../source/lib/game-math/shop'
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

function moneyForShopClosureMacro(t: ExecutionContext, existingShops: number, productsInShop: number, isBuildable: boolean, expectedMoney: number): void {
	t.is(moneyForShopClosure(existingShops, productsInShop, isBuildable), expectedMoney)
}

test('moneyForShopClosure with 2 shops 0 products buildable', moneyForShopClosureMacro, 2, 0, true, 500)
test('moneyForShopClosure with 2 shops 5 products buildable', moneyForShopClosureMacro, 2, 5, true, 500 + 2000)
test('moneyForShopClosure with 2 shops 0 products not buildable', moneyForShopClosureMacro, 2, 0, false, 1000)
test('moneyForShopClosure with 2 shops 5 products not buildable', moneyForShopClosureMacro, 2, 5, false, 1000 + 4000)

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
