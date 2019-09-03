import gaussian from 'gaussian'
import randomItem from 'random-item'

import {Person, Talents, TALENTS} from '../types/people'
import {Skills} from '../types/skills'

import * as wdName from '../wikidata/name'
import * as wdShops from '../wikidata/shops'

import {DAY_IN_SECONDS} from '../math/timestamp-constants'

import {maxDaysUntilRetirement} from '../game-math/applicant'

export function createApplicant(skills: Skills, now: number): Person {
	const name = wdName.randomName()
	const retirementTimespan = DAY_IN_SECONDS * maxDaysUntilRetirement(skills)

	return {
		name,
		hobby: randomItem(wdShops.allShops()),
		retirementTimestamp: Math.ceil(now + (Math.random() * retirementTimespan)),
		talents: randomTalents()
	}
}

const MINIMAL_TALENT = 0.001
const talentDistribution = gaussian(1.05, 0.045)
/* DEBUG
console.log('talentDistribution', talentDistribution.mean, talentDistribution.variance)
console.log('talentDistribution probability', '<0  :', talentDistribution.cdf(MINIMAL_TALENT))
console.log('talentDistribution probability', '<0.2:', talentDistribution.cdf(0.2))
console.log('talentDistribution probability', '>1  :', 1 - talentDistribution.cdf(1))
console.log('talentDistribution probability', '>1.2:', 1 - talentDistribution.cdf(1.2))
console.log('talentDistribution probability', '>1.5:', 1 - talentDistribution.cdf(1.5))
console.log('talentDistribution probability', '>1.8:', 1 - talentDistribution.cdf(1.8))
console.log('talentDistribution probability', '>2  :', 1 - talentDistribution.cdf(2))
console.log('talentDistribution probability', '>2.5:', 1 - talentDistribution.cdf(2.5))
/**/

function randomTalents(): Talents {
	const talents: any = {}
	for (const t of TALENTS) {
		const factor = talentDistribution.ppf(Math.random())
		talents[t] = Math.max(MINIMAL_TALENT, factor)
	}

	return talents
}
