import test from 'ava'

import {sortDictByNumericValue, sortDictByStringValue} from '../../source/lib/js-helper/dictionary'

test('sortDictByNumericValue', t => {
	const input = {
		a: 5,
		b: 2,
		c: 8,
		d: 0
	}

	const result = sortDictByNumericValue(input)
	t.log(JSON.stringify(result))
	t.deepEqual(Object.keys(result), ['d', 'b', 'a', 'c'])
})

test('sortDictByNumericValue reversed', t => {
	const input = {
		a: 5,
		b: 2,
		c: 8,
		d: 0
	}

	const result = sortDictByNumericValue(input, true)
	t.log(JSON.stringify(result))
	t.deepEqual(Object.keys(result), ['c', 'a', 'b', 'd'])
})

test('sortDictByNumericValue values correct', t => {
	const input = {
		a: 5,
		b: 2,
		c: 8,
		d: 0
	}

	const result = sortDictByNumericValue(input)
	t.log(JSON.stringify(result))
	// Ava compares without respecting order
	t.deepEqual(result, {
		a: 5,
		b: 2,
		c: 8,
		d: 0
	})
})

test('sortDictByStringValue', t => {
	const input = {
		a: 'Baum',
		b: 'Tisch',
		c: 'Stuhl',
		d: 'Apfel'
	}

	const result = sortDictByStringValue(input)
	t.log(JSON.stringify(result))
	t.deepEqual(Object.keys(result), ['d', 'a', 'c', 'b'])
})

test('sortDictByStringValue locale de', t => {
	const input = {
		a: 'Baum',
		b: 'Tisch',
		c: 'Stuhl',
		d: 'Apfel'
	}

	const result = sortDictByStringValue(input, 'de')
	t.log(JSON.stringify(result))
	t.deepEqual(Object.keys(result), ['d', 'a', 'c', 'b'])
})

test('sortDictByStringValue values correct', t => {
	const input = {
		a: 'Baum',
		b: 'Tisch',
		c: 'Stuhl',
		d: 'Apfel'
	}

	const result = sortDictByStringValue(input)
	t.log(JSON.stringify(result))
	// Ava compares without respecting order
	t.deepEqual(result, {
		a: 'Baum',
		b: 'Tisch',
		c: 'Stuhl',
		d: 'Apfel'
	})
})
