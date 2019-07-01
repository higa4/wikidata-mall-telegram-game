import {Session} from '../types'

import applicants from './applicants'

export default function middleware(): (ctx: any, next: any) => void {
	return (ctx, next) => {
		const session = ctx.session as Session
		const now = Date.now() / 1000

		init(session)
		applicants(session, now)

		return next()
	}
}

function init(session: Session): void {
	const {
		money,
		shops
	} = session

	if (!isFinite(money)) {
		session.money = 5
	}

	if (!shops) {
		session.shops = {}
	}
}
