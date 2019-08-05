import test from 'ava'

import {formatFloat, formatInt} from '../../source/lib/interface/format-number'

test('formatFloat positive bigger 1', t => {
	t.is(formatFloat(1), '1.00')
	t.is(formatFloat(10), '10.0')
	t.is(formatFloat(100), '100')
	t.is(formatFloat(500), '500')
	t.is(formatFloat(500.02), '500')
	t.is(formatFloat(1000), '1.00k')
	t.is(formatFloat(1500), '1.50k')
	t.is(formatFloat(1500.2), '1.50k')
	t.is(formatFloat(1560), '1.56k')
	t.is(formatFloat(1567), '1.57k')
	t.is(formatFloat(10000), '10.0k')
})

test('formatFloat zero', t => {
	t.is(formatFloat(0), '0.00')
	t.is(formatFloat(-0), '0.00')
})

test('formatFloat positive smaller 1', t => {
	t.is(formatFloat(0.01), '0.0100')
	t.is(formatFloat(0.1), '0.100')
})

test('formatFloat negative bigger 1', t => {
	t.is(formatFloat(-1), '-1.00')
	t.is(formatFloat(-10), '-10.0')
	t.is(formatFloat(-100), '-100')
	t.is(formatFloat(-1000), '-1.00k')
	t.is(formatFloat(-10000), '-10.0k')
})

test('formatInt', t => {
	t.is(formatInt(0), '0')
	t.is(formatInt(1), '1')
	t.is(formatInt(10), '10')
	t.is(formatInt(100), '100')
	t.is(formatInt(1000), '1.00k')
	t.is(formatInt(10000), '10.0k')
})
