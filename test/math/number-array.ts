import test, {ExecutionContext} from 'ava'

import {average} from '../../source/lib/math/number-array'

function averageMacro(t: ExecutionContext, expected: number, ...inputs: number[]): void {
	t.is(average(inputs), expected)
}

test('average 0 inputs', t => {
	t.true(isNaN(average([])))
})

test('average of 1 input is the input', averageMacro, 42, 42)
test('average of two inputs', averageMacro, 5, 0, 10)
test('average of three inputs', averageMacro, 5, 0, 5, 10)
