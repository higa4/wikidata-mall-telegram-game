import test from 'ava'

import {formatFloat, formatInt} from '../../source/lib/interface/format-number'

test('formatFloat positive bigger 1', t => {
	t.is(formatFloat(1), '1.00')
	t.is(formatFloat(10), '10.00')
	t.is(formatFloat(100), '100.00')
	t.is(formatFloat(500), '500.00')
	t.is(formatFloat(1000), '1.00k')
	t.is(formatFloat(1500), '1.50k')
	t.is(formatFloat(10000), '10.00k')
})

test('formatFloat zero', t => {
	t.is(formatFloat(0), '0.00')
	t.is(formatFloat(-0), '0.00')
})

test('formatFloat positive smaller 1', t => {
	t.is(formatFloat(0.01), '0.01')
	t.is(formatFloat(0.1), '0.10')
})

test('formatFloat negative bigger 1', t => {
	t.is(formatFloat(-1), '-1.00')
	t.is(formatFloat(-10), '-10.00')
	t.is(formatFloat(-100), '-100.00')
	t.is(formatFloat(-1000), '-1.00k')
	t.is(formatFloat(-10000), '-10.00k')
})

test('formatInt', t => {
	t.is(formatInt(0), '0')
	t.is(formatInt(1), '1')
	t.is(formatInt(10), '10')
	t.is(formatInt(100), '100')
	t.is(formatInt(1000), '1.00k')
	t.is(formatInt(10000), '10.00k')
})
