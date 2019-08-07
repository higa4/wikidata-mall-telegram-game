import test from 'ava'

import {destructionProbability} from '../../source/lib/game-math/distaster'

test('destructionProbability stacked', t => {
	const weeks: number[] = []
	const days = 3
	let alive = 1
	for (let i = 0; i < 50; i++) {
		const probabilityDeath = destructionProbability(days + (i * 7))
		alive *= 1 - probabilityDeath
		weeks.push(alive)
	}

	const months = weeks.filter((_, i) => i % 4 === 0)

	t.log('weeks', weeks.slice(0, 9))
	t.log('months', months)
	t.true(months[1] > 0.9)
	t.true(months[2] > 0.7)
	t.true(months[3] > 0.5)
	t.true(months[4] > 0.3)
	t.true(months[5] > 0.1)
})
