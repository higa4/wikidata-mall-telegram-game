import {Session, Persist} from '../types'
import {Achievements, AchievementSet} from '../types/achievements'

import * as fibonacci from '../math/fibonacci'

export default function applyAchievements(session: Session, persist: Persist, now: number): void {
	if (!session.achievements) {
		session.achievements = {
			gameStarted: now
		}
	}

	addMoneyCollected(session, now)
	addProductsBought(session, now)
	addProductsInAssortment(session, persist, now)
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

function addProductsInAssortment(session: Session, persist: Persist, now: number): void {
	const productsInAssortment = persist.shops.flatMap(o => o.products).length
	checkIfReachedNumeric(
		session.achievements,
		'productsInAssortment',
		productsInAssortment,
		now,
		1,
		fibonacci.stateful()
	)
}

function addProductsBought(session: Session, now: number): void {
	checkIfReachedNumeric(
		session.achievements,
		'productsBought',
		session.stats.productsBought,
		now,
		100,
		fibonacci.stateful(100)
	)
}

function addMoneyCollected(session: Session, now: number): void {
	checkIfReachedNumeric(
		session.achievements,
		'moneyCollected',
		session.money,
		now,
		1000,
		fibonacci.stateful(1000)
	)
}
