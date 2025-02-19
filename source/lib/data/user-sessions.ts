import randomItem from 'random-item'
import stringify from 'json-stable-stringify'

import {Session} from '../types'

/* eslint @typescript-eslint/no-var-requires: warn */
/* eslint @typescript-eslint/no-require-imports: warn */
const LocalSession = require('telegraf-session-local')

interface SessionRawEntry {
	user: number;
	data: Session;
}

const localSession = new LocalSession({
	// Database name/path, where sessions will be located (default: 'sessions.json')
	database: 'persist/sessions.json',
	// Format of storage/database (default: JSON.stringify / JSON.parse)
	format: {
		serialize: (obj: any) => stringify(obj, {space: '\t'}) + '\n',
		deserialize: (str: string) => JSON.parse(str)
	},
	getSessionKey: (ctx: any) => `${ctx.from.id}`
})

export function getRaw(): readonly SessionRawEntry[] {
	return localSession.DB
		.get('sessions').value()
		.map((o: {id: string; data: any}) => {
			const user = Number(o.id.split(':')[0])
			return {user, data: o.data}
		})
}

export function getUser(userId: number): any {
	return localSession.DB
		.get('sessions')
		.getById(`${userId}`)
		.get('data')
		.value() || {}
}

export function removeUser(userId: number): void {
	return localSession.DB
		.get('sessions')
		.removeById(String(userId))
}

export function getRandomUser(filter: (o: SessionRawEntry) => boolean = () => true): SessionRawEntry {
	const rawArr = getRaw()
		.filter(filter)
	return randomItem(rawArr)
}

export function middleware(): (ctx: any, next: any) => void {
	return localSession.middleware()
}
