import {Session, Persist} from '../types'

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

	if (session.applicantWaiting && session.applicantWaiting.retirementTimestamp < now) {
		delete session.applicantWaiting
	}
}

function addWaitingApplicants(session: Session, persist: Persist, now: number): void {
	const interval = secondsBetweenApplicants(persist.skills)
	const secondsSinceLastApplicant = now - session.applicantTimestamp
	const possibleApplicants = Math.floor(secondsSinceLastApplicant / interval)
	if (possibleApplicants <= 0) {
		return
	}

	if (session.applicantWaiting) {
		return
	}

	session.applicantWaiting = createApplicant(persist.skills, now)
	session.applicantTimestamp = now
}
