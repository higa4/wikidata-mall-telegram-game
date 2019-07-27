import test, {ExecutionContext} from 'ava'

import {distanceDiversity} from '../../source/lib/math/distance'

function isSane(t: ExecutionContext, ...values: number[]): void {
	t.log(values)
	const result = distanceDiversity(values)
	t.log(result)
	t.true(Number.isFinite(result))
	t.true(result > 0)
}

test('one input', isSane, 1)

test('two inputs', isSane, 1, 5)

test('two equal values', isSane, 5, 5)

test('three inputs', isSane, 1, 5, 9)

test('ordered', t => {
	const veryVeryBad = distanceDiversity([9, 9, 9, 9, 9])
	const veryBad = distanceDiversity([8, 8, 9, 9, 9])
	const semiBad = distanceDiversity([1, 1, 5, 9, 9])
	const nearlyPerfect = distanceDiversity([1, 2, 5, 7, 9])
	const perfect = distanceDiversity([1, 3, 5, 7, 9])

	t.log(veryVeryBad)
	t.log(veryBad)
	t.log(semiBad)
	t.log(nearlyPerfect)
	t.log(perfect)

	t.true(veryVeryBad < veryBad)
	t.true(veryBad < semiBad)
	t.true(semiBad < nearlyPerfect)
	t.true(nearlyPerfect < perfect)
})
