import {ContextMessageUpdate, Middleware} from 'telegraf'
import {User} from 'telegram-typings'
import stringify from 'json-stable-stringify'

import {InMemoryFiles} from './datastore'

type Dictionary<T> = {[key: string]: T}

console.time('load user info')
const data = new InMemoryFiles<User>('persist/user-info')
console.timeEnd('load user info')

export async function get(id: number): Promise<User | undefined> {
	return data.get(String(id))
}

export async function getAll(): Promise<Dictionary<User>> {
	return data.entries()
}

export function middleware(): Middleware<ContextMessageUpdate> {
	return async (ctx, next) => {
		if (ctx.from) {
			const old = await data.get(String(ctx.from.id))
			const oldString = stringify(old)
			const current = stringify(ctx.from)
			if (oldString !== current) {
				await data.set(String(ctx.from.id), ctx.from)
			}
		}

		return next && next()
	}
}
