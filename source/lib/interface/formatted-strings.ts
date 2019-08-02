import WikidataEntityReader from 'wikidata-entity-reader'

interface InfoHeaderOptions {
	titlePrefix?: string;
	titleSuffix?: string;
}

export function infoHeader(wdr: WikidataEntityReader, options: InfoHeaderOptions = {}): string {
	const {titlePrefix, titleSuffix} = options
	const label = wdr.label()
	const description = wdr.description()

	let text = ''

	if (titlePrefix) {
		text += titlePrefix
		text += ' '
	}

	text += `*${label}*`

	if (titleSuffix) {
		text += ' '
		text += titleSuffix
	}

	if (description) {
		text += '\n'
		text += `${description}`
	}

	return text
}

export function percentString(percent: number): string {
	return (percent * 100).toFixed(1) + '%'
}

export function bonusPercentString(percent: number): string {
	const plusMinusHundred = (percent - 1) * 100
	return `${plusMinusHundred >= 0 ? '+' : ''}${plusMinusHundred.toFixed(1)}%`
}

export function labeledFloat(wdr: WikidataEntityReader, num: number, unit = ''): string {
	return `${wdr.label()}: ${formattedNumber(num, false)}${unit}`
}

export function labeledInt(wdr: WikidataEntityReader, num: number, unit = ''): string {
	return `${wdr.label()}: ${formattedNumber(num, true)}${unit}`
}

export function humanReadableTimestamp(unixTimestamp: number, locale: string): string {
	const date = new Date(unixTimestamp * 1000)
	return date.toLocaleString(locale, {
		timeZone: 'UTC',
		timeZoneName: 'short',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit'
	})
}

const LETTERS = ['', 'k', 'M', 'G', 'T', 'P', 'E']

export function formattedNumber(num: number, isInt: boolean): string {
	const exp = Math.floor(Math.log10(Math.abs(num)))
	const sciExp = Math.max(0, Math.floor(exp / 3) * 3)
	const sciNum = 10 ** sciExp

	if (sciNum === 0) {
		return '0'
	}

	const relevantNumPart = num / sciNum

	const fractionDigits = isInt && sciExp < 2 ? 0 : 2
	const numberString = relevantNumPart.toFixed(fractionDigits)

	const letterString = LETTERS[sciExp / 3]

	return numberString + letterString
}
