import gaussian from 'gaussian'
import randomItem from 'random-item'

import {Session, Persist} from '../types'
import {Talents, TALENTS} from '../types/people'

import * as wdName from '../wikidata/name'
import * as wdShops from '../wikidata/shops'

export default function calcApplicants(session: Session, persist: Persist, now: number): void {
	if (!session.applicants) {
		session.applicants = []
		session.applicantTimestamp = now
	}

	retireWaitingApplicants(session, now)
	addWaitingApplicants(session, persist, now)
}

function retireWaitingApplicants(session: Session, now: number): void {
	session.applicants = session.applicants.filter(person => person.retirementTimestamp > now)
}

function addWaitingApplicants(session: Session, persist: Persist, now: number): void {
	const {applicantTimestamp, applicants} = session

	const secondsBetweenApplicants = 60 // TODO: Skills
	const retirementTimespan = 60 * 60 * 24 * 30 // 30 days

	const secondsSinceLastApplicant = now - applicantTimestamp
	const possibleApplicants = Math.floor(secondsSinceLastApplicant / secondsBetweenApplicants)
	if (possibleApplicants <= 0) {
		return
	}

	if (wdShops.allShops().length === 0) {
		// Wait for init
		return
	}

	const freeApplicantSeats = Object.keys(persist.shops).length - applicants.length
	const creatableApplicants = Math.min(possibleApplicants, freeApplicantSeats)

	// Ensure timer is still running when there are free seats.
	// If not reset the timer to now
	const newTimestamp = applicantTimestamp + (creatableApplicants * secondsBetweenApplicants)
	session.applicantTimestamp = freeApplicantSeats > 0 ? newTimestamp : now

	for (let i = 0; i < creatableApplicants; i++) {
		const name = wdName.randomName()

		session.applicants.push({
			name,
			hobby: randomItem(wdShops.allShops()),
			retirementTimestamp: Math.ceil(now + (Math.random() * retirementTimespan)),
			talents: randomTalents()
		})
	}
}

const MINIMAL_TALENT = 0.001
const talentDistribution = gaussian(1, 0.1)
/* DEBUG
console.log('talentDistribution propability', '<0  :', talentDistribution.cdf(MINIMAL_TALENT))
console.log('talentDistribution propability', '<0.2:', talentDistribution.cdf(0.2))
console.log('talentDistribution propability', '>1  :', 1 - talentDistribution.cdf(1))
console.log('talentDistribution propability', '>1.5:', 1 - talentDistribution.cdf(1.5))
console.log('talentDistribution propability', '>1.8:', 1 - talentDistribution.cdf(1.8))
console.log('talentDistribution propability', '>2  :', 1 - talentDistribution.cdf(2))
console.log('talentDistribution propability', '>2.5:', 1 - talentDistribution.cdf(2.5))
/**/

function randomTalents(): Talents {
	const talents: any = {}
	for (const t of TALENTS) {
		const factor = talentDistribution.ppf(Math.random())
		talents[t] = Math.max(MINIMAL_TALENT, factor)
	}

	return talents
}
