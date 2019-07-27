import test from 'ava'

import {distanceSteps} from '../../source/lib/math/distance'

test('steps empty input', t => {
	t.deepEqual(distanceSteps([]), [])
})

test('steps one input', t => {
	t.deepEqual(distanceSteps([1]), [])
})

test('steps two same inputs', t => {
	t.deepEqual(distanceSteps([5, 5]), [0])
})

test('steps three same inputs', t => {
	t.deepEqual(distanceSteps([5, 5, 5]), [0, 0])
})

test('steps two different inputs', t => {
	t.deepEqual(distanceSteps([5, 10]), [5])
})

test('steps three equidistant inputs', t => {
	t.deepEqual(distanceSteps([1, 2, 3]), [1, 1])
})

test('steps tree different inputs', t => {
	t.deepEqual(distanceSteps([5, 10, 50]), [5, 40])
})
