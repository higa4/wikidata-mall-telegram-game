import {Skills} from '../types/skills'

import {InMemoryFiles} from './datastore'
import {generatePersistMiddleware} from './persist-middleware'

console.time('load user skills')
const data = new InMemoryFiles<Skills>('persist/skills')
console.timeEnd('load user skills')

export function middleware(): (ctx: any, next: any) => Promise<void> {
	return generatePersistMiddleware('skills', data)
}
