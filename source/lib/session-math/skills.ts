import {Session, Persist} from '../types'
import {currentLevel, skillUpgradeTimeNeeded, increaseLevelByOne} from '../game-math/skill'

const SECONDS_IN_HOUR = 60 * 60

export default function applySkills(session: Session, persist: Persist, now: number): void {
	if (session.skillInTraining) {
		ensureCurrentlyTrainedSkillForShopHasItsShop(session, persist)
		applySkillWhenFinished(session, persist, now)
	}
}

function ensureCurrentlyTrainedSkillForShopHasItsShop(session: Session, persist: Persist): void {
	const {product} = session.skillInTraining!
	if (!product) {
		return
	}

	const shopExists = persist.shops.some(o => o.id === product)
	if (!shopExists) {
		delete session.skillInTraining
	}
}

function applySkillWhenFinished(session: Session, persist: Persist, now: number): void {
	const {skill, product, startTimestamp} = session.skillInTraining!

	const level = currentLevel(persist.skills, skill, product)
	const hoursNeeded = skillUpgradeTimeNeeded(level)
	const requiredTimestamp = startTimestamp + (hoursNeeded * SECONDS_IN_HOUR)

	if (now > requiredTimestamp) {
		increaseLevelByOne(persist.skills, skill, product)
		delete session.skillInTraining
	}
}
