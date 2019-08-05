import test from 'ava'

import {percentString, percentBonusString} from '../../source/lib/interface/format-percent'

test('percentString', t => {
	t.is(percentString(0), '0.0%')
	t.is(percentString(0.1), '10.0%')
	t.is(percentString(0.5), '50.0%')
	t.is(percentString(1), '100.0%')
	t.is(percentString(1.5), '150.0%')
	t.is(percentString(2), '200.0%')
})

test('percentBonusString', t => {
	t.is(percentBonusString(0), '-100.0%')
	t.is(percentBonusString(0.1), '-90.0%')
	t.is(percentBonusString(0.5), '-50.0%')
	t.is(percentBonusString(1), '+0.0%')
	t.is(percentBonusString(1.5), '+50.0%')
	t.is(percentBonusString(2), '+100.0%')
})
