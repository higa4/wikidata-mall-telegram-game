import {Session} from '../types'

import achievements from './achievements'
import applicants from './applicants'
import income from './income'
import personal from './personal'

export default function middleware(): (ctx: any, next: any) => Promise<void> {
	return async (ctx, next) => {
		const session = ctx.session as Session
		const now = Date.now() / 1000

		init(session)
		applicants(session, now)
		personal(session, now)
		income(session, now)

		await next()

		achievements(session, now)
	}
}

function init(session: Session): void {
	const {
		money,
		shops
	} = session

	if (!isFinite(money)) {
		session.money = 300
	}

	if (!shops) {
		session.shops = []
	}
}
