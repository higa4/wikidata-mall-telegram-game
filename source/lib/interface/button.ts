type ConstOrPromise<T> = T | Promise<T>
type Func<T> = (ctx: any) => ConstOrPromise<T>
type ConstOrContextFunc<T> = T | Func<T>

export function buttonText(emoji: ConstOrContextFunc<string>, resourceKey: string): (ctx: any) => Promise<string> {
	return async (ctx: any) => {
		const emojiString = typeof emoji === 'function' ? await emoji(ctx) : emoji
		return `${emojiString} ${ctx.wd.r(resourceKey).label()}`
	}
}
