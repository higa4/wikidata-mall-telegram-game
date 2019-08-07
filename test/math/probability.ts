import test, {ExecutionContext} from 'ava'

import {happens} from '../../source/lib/math/probability'

function happensMacro(t: ExecutionContext, probability: number, arrTrue: (arr: readonly boolean[]) => boolean): void {
	const runs = 1000
	const values: boolean[] = []
	for (let i = 0; i < runs; i++) {
		values.push(happens(probability))
	}

	const amountTrue = values.filter(o => o === true).length
	const amountFalse = runs - amountTrue

	t.log((amountTrue / runs).toFixed(3), 'true')
	t.log((amountFalse / runs).toFixed(3), 'false')

	t.true(arrTrue(values))
}

function happensSometimesMacro(t: ExecutionContext, probability: number): void {
	return happensMacro(t, probability, arr => arr.some(o => o === true) && arr.some(o => o === false))
}

test('happens not', happensMacro, 0, arr => arr.every(o => o === false))
test('happens definitely', happensMacro, 1, arr => arr.every(o => o === true))
test('happens sometimes 0.1', happensSometimesMacro, 0.1)
test('happens sometimes 0.5', happensSometimesMacro, 0.5)
test('happens sometimes 0.9', happensSometimesMacro, 0.9)
