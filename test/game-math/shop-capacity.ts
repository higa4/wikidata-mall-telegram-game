import test, {ExecutionContext} from 'ava'

import {Shop, Product} from '../../source/lib/types/shop'
import {Skills} from '../../source/lib/types/skills'

import {
	shopProductsPossible,
	storageFilledPercentage
} from '../../source/lib/game-math/shop-capacity'

function storageFilledPercentageMacro(t: ExecutionContext, amounts: number[], expected: number): void {
	const skills: Skills = {}
	const products: Product[] = amounts.map(o => ({id: 'Q42', itemTimestamp: 0, itemsInStore: o}))
	const shop: Shop = {
		id: 'Q5',
		opening: 0,
		personal: {},
		products
	}

	t.is(storageFilledPercentage(shop, skills), expected)
}

test('storageFilledPercentage without products', storageFilledPercentageMacro, [], 0)
test('storageFilledPercentage one product empty', storageFilledPercentageMacro, [0], 0)
test('storageFilledPercentage one product full', storageFilledPercentageMacro, [100], 1)
test('storageFilledPercentage two product empty', storageFilledPercentageMacro, [0, 0], 0)
test('storageFilledPercentage two product full', storageFilledPercentageMacro, [100, 100], 1)
test('storageFilledPercentage two product empty and full', storageFilledPercentageMacro, [0, 100], 0.5)
test('storageFilledPercentage two product half full', storageFilledPercentageMacro, [50, 50], 0.5)

function shopProductsPossibleMacro(t: ExecutionContext, level: number, expected: number): void {
	t.is(shopProductsPossible(level), expected)
}

test('shopProductsPossible 0', shopProductsPossibleMacro, 0, 2)
test('shopProductsPossible 1', shopProductsPossibleMacro, 1, 3)
test('shopProductsPossible 2', shopProductsPossibleMacro, 2, 4)
test('shopProductsPossible 4', shopProductsPossibleMacro, 4, 6)
