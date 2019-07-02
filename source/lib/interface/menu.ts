import WikidataEntityReader from 'wikidata-entity-reader'

type ConstOrPromise<T> = T | Promise<T>
type Func<T> = (ctx: any) => ConstOrPromise<T>
type ConstOrContextFunc<T> = T | Func<T>

export function buttonText(emoji: ConstOrContextFunc<string>, resourceKey: string): (ctx: any) => Promise<string> {
	return async (ctx: any) => {
		const emojiString = typeof emoji === 'function' ? await emoji(ctx) : emoji
		return `${emojiString} ${ctx.wd.r(resourceKey).label()}`
	}
}

export function menuPhoto(qNumberOrResourceKey: ConstOrContextFunc<string>): (ctx: any) => Promise<string> {
	return async (ctx: any) => {
		const asString = typeof qNumberOrResourceKey === 'function' ? await qNumberOrResourceKey(ctx) : qNumberOrResourceKey
		const reader = ctx.wd.r(asString) as WikidataEntityReader
		return reader.images(800)[0]
	}
}
