import test from 'ava'

import {stateful} from '../../source/lib/math/fibonacci'

test('stateful example', t => {
	const func = stateful()
	t.is(func(1), 2)
	t.is(func(2), 3)
	t.is(func(3), 5)
	t.is(func(5), 8)
	t.is(func(8), 13)
})
