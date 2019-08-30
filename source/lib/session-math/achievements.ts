import {Session, Persist} from '../types'

export default function applyAchievements(session: Session, _persist: Persist, now: number): void {
	if (!session.achievements) {
		session.achievements = {
			gameStarted: now
		}
	}

	// Cleanup old session objects
	const keys = Object.keys(session.achievements)
		.filter(o => o !== 'gameStarted')

	for (const key of keys) {
		delete (session.achievements as any)[key]
	}
}

