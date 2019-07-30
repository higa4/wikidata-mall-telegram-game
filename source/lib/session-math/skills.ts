import {Session, Persist} from '../types'
import {currentLevel, increaseLevelByOne, skillUpgradeEndTimestamp} from '../game-math/skill'

export default function applySkills(session: Session, persist: Persist, now: number): void {
	if (session.skillInTraining) {
		ensureCurrentlyTrainedSkillForShopHasItsShop(session, persist)
		applySkillWhenFinished(session, persist, now)
	}
}

function ensureCurrentlyTrainedSkillForShopHasItsShop(session: Session, persist: Persist): void {
	const {category} = session.skillInTraining!
	if (!category) {
		return
	}

	const shopExists = persist.shops.some(o => o.id === category)
	if (!shopExists) {
		delete session.skillInTraining
	}
}

function applySkillWhenFinished(session: Session, persist: Persist, now: number): void {
	const {skill, category, startTimestamp} = session.skillInTraining!

	const level = currentLevel(persist.skills, skill, category)
	const endTimestamp = skillUpgradeEndTimestamp(level, startTimestamp)

	if (now > endTimestamp) {
		increaseLevelByOne(persist.skills, skill, category)
		delete session.skillInTraining
	}
}
