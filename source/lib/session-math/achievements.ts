import {Session} from '../types'

export default function applyAchievements(session: Session, now: number): void {
	if (!session.achievements) {
		session.achievements = {
			gameStarted: now
		}
	}

	addShopsOpened(session, now)
}

function addShopsOpened(session: Session, now: number): void {
	const {achievements, shops} = session

	if (!achievements.shopsOpened) {
		achievements.shopsOpened = {}
	}

	for (let i = 1; i <= shops.length; i++) {
		if (!achievements.shopsOpened[i]) {
			achievements.shopsOpened[i] = now
		}
	}
}

