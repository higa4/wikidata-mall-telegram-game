import test, {ExecutionContext} from 'ava'

import {costForAdditionalShop, costForAdditionalProduct, moneyForShopClosure} from '../../source/lib/game-math/shop'

function costForAdditionalShopMacro(t: ExecutionContext, existingShops: number, expectedCost: number): void {
	t.is(costForAdditionalShop(existingShops), expectedCost)
}

test('costForAdditionalShop 0 shops', costForAdditionalShopMacro, 0, 100)
test('costForAdditionalShop 1 shops', costForAdditionalShopMacro, 1, 1000)
test('costForAdditionalShop 2 shops', costForAdditionalShopMacro, 2, 10000)
test('costForAdditionalShop 3 shops', costForAdditionalShopMacro, 3, 100000)

function costForAdditionalProductMacro(t: ExecutionContext, existingShops: number, existingProducts: number, expectedCost: number): void {
	t.is(costForAdditionalProduct(existingShops, existingProducts), expectedCost)
}

test('costForAdditionalProduct 1 shops 0 products', costForAdditionalProductMacro, 1, 0, 0)
test('costForAdditionalProduct 2 shops 0 products', costForAdditionalProductMacro, 2, 0, 0)
test('costForAdditionalProduct 3 shops 0 products', costForAdditionalProductMacro, 3, 0, 0)

test('costForAdditionalProduct 1 shops 1 products', costForAdditionalProductMacro, 1, 1, 100)
test('costForAdditionalProduct 2 shops 1 products', costForAdditionalProductMacro, 2, 1, 1000)
test('costForAdditionalProduct 3 shops 1 products', costForAdditionalProductMacro, 3, 1, 10000)

test('costForAdditionalProduct 1 shops 4 products', costForAdditionalProductMacro, 1, 4, 400)
test('costForAdditionalProduct 2 shops 4 products', costForAdditionalProductMacro, 2, 4, 4000)
test('costForAdditionalProduct 3 shops 4 products', costForAdditionalProductMacro, 3, 4, 40000)

function moneyForShopClosureMacro(t: ExecutionContext, existingShops: number, productsInShop: number, isBuildable: boolean, expectedMoney: number): void {
	t.is(moneyForShopClosure(existingShops, productsInShop, isBuildable), expectedMoney)
}

test('moneyForShopClosure with 2 shops 0 products buildable', moneyForShopClosureMacro, 2, 0, true, 500)
test('moneyForShopClosure with 2 shops 5 products buildable', moneyForShopClosureMacro, 2, 5, true, 500 + 2000)
test('moneyForShopClosure with 2 shops 0 products not buildable', moneyForShopClosureMacro, 2, 0, false, 1000)
test('moneyForShopClosure with 2 shops 5 products not buildable', moneyForShopClosureMacro, 2, 5, false, 1000 + 4000)
