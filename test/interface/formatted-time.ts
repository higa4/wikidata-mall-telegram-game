import test from 'ava'

import {countdownHourMinute} from '../../source/lib/interface/formatted-time'

test('countdownHourMinute examples', t => {
	t.is(countdownHourMinute(42), '0:00')
	t.is(countdownHourMinute(60), '0:01')
	t.is(countdownHourMinute(10 * 60), '0:10')
	t.is(countdownHourMinute(60 * 60), '1:00')
	t.is(countdownHourMinute(65 * 60), '1:05')
	t.is(countdownHourMinute(600 * 60 * 60), '600:00')
})
