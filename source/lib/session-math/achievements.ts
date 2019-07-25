import {Session, Persist} from '../types'
import {Achievements, AchievementSet} from '../types/achievements'

export default function applyAchievements(session: Session, persist: Persist, now: number): void {
	if (!session.achievements) {
		session.achievements = {
			gameStarted: now
		}
	}

	addShopsOpened(session, persist, now)
}

function checkIfReachedNumeric(
	achievements: Achievements,
	achievementSetKey: keyof Achievements,
	currentValue: number,
	now: number,
	initialValue: number,
	increase: (curr: number) => number,
): void {
	if (!achievements[achievementSetKey]) {
		achievements[achievementSetKey] = {} as any
	}

	const achievementSet = achievements[achievementSetKey] as AchievementSet

	for (let i = initialValue; i <= currentValue; i = increase(i)) {
		if (!achievementSet[i]) {
			achievementSet[i] = now
		}
	}
}

function addShopsOpened(session: Session, persist: Persist, now: number): void {
	checkIfReachedNumeric(
		session.achievements,
		'shopsOpened',
		persist.shops.length,
		now,
		1,
		curr => curr + 1,
	)
}
