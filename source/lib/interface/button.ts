export function buttonText(emoji: string, resourceKey: string): (ctx: any) => string {
	return (ctx: any) => `${emoji} ${ctx.wd.r(resourceKey).label()}`
}
