import {Session, Persist} from '../types'

import {isSimpleSkill} from '../game-math/skill'

import {increaseLevelByOne} from '../game-logic/skills'

export default function applySkills(session: Session, persist: Persist, now: number): void {
	if (session.skillInTraining) {
		session.skillQueue = [
			session.skillInTraining
		]
		delete session.skillInTraining
	}

	if (session.skillQueue) {
		ensureCurrentlyTrainedSkillForShopHasItsShop(session, persist)
		applySkillWhenFinished(session, persist, now)
	}
}

function ensureCurrentlyTrainedSkillForShopHasItsShop(session: Session, persist: Persist): void {
	const existingShops = persist.shops.map(o => o.id)

	session.skillQueue = session.skillQueue!
		.filter(o => !o.category || existingShops.includes(o.category))
}

function applySkillWhenFinished(session: Session, persist: Persist, now: number): void {
	for (const skillInTraining of session.skillQueue!) {
		const {skill, category, endTimestamp} = skillInTraining
		if (endTimestamp > now) {
			break
		}

		if (isSimpleSkill(skill)) {
			increaseLevelByOne(persist.skills, skill)
		} else {
			increaseLevelByOne(persist.skills, skill, category!)
		}
	}

	session.skillQueue = session.skillQueue!
		.filter(o => o.endTimestamp > now)
}
