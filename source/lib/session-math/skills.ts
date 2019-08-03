import {Session, Persist} from '../types'
import {increaseLevelByOne} from '../game-math/skill'

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
	const {skill, category, endTimestamp} = session.skillInTraining!

	// SkillInTraining had startTimestamp and no endTimestamp -> undefined -> just skill it now as part of migration
	if (now > (endTimestamp || 0)) {
		increaseLevelByOne(persist.skills, skill, category)
		delete session.skillInTraining
	}
}
