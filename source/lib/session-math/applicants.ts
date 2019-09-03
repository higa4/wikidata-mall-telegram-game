import {Session, Persist} from '../types'

import * as wdShops from '../wikidata/shops'

import {secondsBetweenApplicants} from '../game-math/applicant'

import {createApplicant} from '../game-logic/applicant'

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

	const interval = secondsBetweenApplicants(persist.skills)

	const secondsSinceLastApplicant = now - applicantTimestamp
	const possibleApplicants = Math.floor(secondsSinceLastApplicant / interval)
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
	const newTimestamp = applicantTimestamp + (creatableApplicants * interval)
	session.applicantTimestamp = Math.floor(freeApplicantSeats > 0 ? newTimestamp : now)

	for (let i = 0; i < creatableApplicants; i++) {
		session.applicants.push(
			createApplicant(persist.skills, now)
		)
	}
}
