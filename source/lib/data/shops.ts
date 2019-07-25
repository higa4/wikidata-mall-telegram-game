import stringify from 'json-stable-stringify'

import {Session, Persist} from '../types'
import {Shop} from '../types/shop'

import {InMemoryFiles} from './datastore'

interface Context {
	from: {
		id: number;
	};
	persist: Persist;
	session: Session;
}

console.time('load user shops')
const data = new InMemoryFiles<Shop[]>('persist/shops')
console.timeEnd('load user shops')

async function get(playerId: number): Promise<Shop[]> {
	const result = await data.get(String(playerId))
	return result || []
}

async function save(playerId: number, shops: Shop[]): Promise<void> {
	return data.set(String(playerId), shops)
}

export function middleware(): (ctx: any, next: any) => Promise<void> {
	return async (ctx: Context, next) => {
		if (!ctx.persist) {
			ctx.persist = {
				shops: []
			}
		}

		ctx.persist.shops = await get(ctx.from.id)

		const before = stringify(ctx.persist.shops)
		await next()
		const after = stringify(ctx.persist.shops)

		if (before !== after) {
			await save(ctx.from.id, ctx.persist.shops)
		}
	}
}
