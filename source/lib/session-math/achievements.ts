import {Session, Persist} from '../types'

export default function applyAchievements(session: Session, persist: Persist, now: number): void {
	if (!session.achievements) {
		session.achievements = {
			gameStarted: now
		}
	}

	addShopsOpened(session, persist, now)
}

function addShopsOpened(session: Session, persist: Persist, now: number): void {
	const {achievements} = session
	const {shops} = persist

	if (!achievements.shopsOpened) {
		achievements.shopsOpened = {}
	}

	for (let i = 1; i <= shops.length; i++) {
		if (!achievements.shopsOpened[i]) {
			achievements.shopsOpened[i] = now
		}
	}
}

