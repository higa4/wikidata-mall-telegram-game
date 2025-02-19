import {ContextMessageUpdate, Middleware, Extra} from 'telegraf'
import {InlineKeyboardMarkup} from 'telegram-typings'

export type ErrorMatchRule = RegExp | string

export interface Options {
	inlineKeyboardMarkup?: InlineKeyboardMarkup;
	text?: string;
}

export interface TelegrafErrorPayload {
	photo?: string;
	media?: {
		media: string;
	};
}

export class ErrorMiddleware {
	private readonly _keyboard?: InlineKeyboardMarkup

	private readonly _userText?: string

	constructor(options: Options = {}) {
		this._keyboard = options.inlineKeyboardMarkup
		this._userText = options.text
	}

	middleware(): Middleware<ContextMessageUpdate> {
		return async (ctx, next) => {
			try {
				if (next) {
					await next()
				}
			} catch (error) {
				if (!(error instanceof Error)) {
					throw new TypeError(`Error is not of type error: ${typeof error} ${error}`)
				}

				if (error.message.includes('Too Many Requests')) {
					console.warn('Telegraf Too Many Requests error. Skip.', error)
					return
				}

				if (isMatch(
					error.message,
					'cancelled by new editMessageMedia request',
					'message to edit not found',
					'query is too old'
				)) {
					console.warn('ERROR', ...getUpdateContext(ctx), error.message)
					return
				}

				let text = '🔥 Something went wrong here!'
				if (this._userText) {
					text += '\n'
					text += this._userText
				}

				text += '\n\n'

				const token = (ctx as any).tg.token as string
				text += 'Error: `'
				text += error.message
					.replace(token, '')
				text += '`'
				text += '\n\n'

				const payload = getTelegrafErrorPayload(error)

				if (payload && isMatch(
					error.message,
					'MEDIA_EMPTY',
					'WEBPAGE_CURL_FAILED',
					'wrong file identifier/HTTP URL specified'
				)) {
					// Some problem with the url
					const url = payload.photo || (payload.media && payload.media.media)
					console.warn('Telegram url fail', ...getUpdateContext(ctx), error.message, url || payload)
					if (url) {
						text += 'Problem with this url: '
						text +=	url
						text += '\n\n'
					}
				} else {
					// Generic log
					console.error('ERROR', 'try to send error to user', error.message, ctx.update, error, payload)
				}

				try {
					const target = (ctx.chat || ctx.from!).id
					await ctx.telegram.sendMessage(target, text, Extra.markdown().webPreview(false).markup(this._keyboard))
				} catch (error) {
					console.error('send error to user failed', error)
				}
			}
		}
	}
}

function getUpdateContext(ctx: ContextMessageUpdate): Array<string | number | undefined> {
	const infos: Array<string | number | undefined> = []

	if (ctx.chat) {
		infos.push(ctx.chat.id)
	}

	if (ctx.from) {
		infos.push(ctx.from.id)
	}

	if (ctx.callbackQuery) {
		infos.push(ctx.callbackQuery.data)
	}

	if (ctx.inlineQuery) {
		infos.push(ctx.inlineQuery.offset)
		infos.push(ctx.inlineQuery.query)
	}

	return infos
}

function isMatch(message: string, ...rules: ErrorMatchRule[]): boolean {
	return rules.some(rule =>
		rule instanceof RegExp ? rule.test(message) : message.includes(rule)
	)
}

function getTelegrafErrorPayload(error: any): TelegrafErrorPayload | undefined {
	return error && error.on && error.on.payload
}
