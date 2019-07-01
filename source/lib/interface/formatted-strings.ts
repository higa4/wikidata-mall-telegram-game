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

export function labeledNumber(wdr: WikidataEntityReader, num: number, currency: string): string {
	return `${wdr.label()}: ${formattedInt(num)}${currency}`
}

const LETTERS = ['', 'k', 'M', 'G', 'T', 'P', 'E']

export function formattedInt(num: number): string {
	const exp = Math.floor(Math.log10(Math.abs(num)))
	const sciExp = Math.floor(exp / 3) * 3
	const sciNum = 10 ** sciExp

	if (sciNum === 0) {
		return '0'
	}

	const relevantNumPart = num / sciNum

	const fractionDigits = sciExp > 2 ? 2 : 0
	const numberString = relevantNumPart.toFixed(fractionDigits)

	const letterString = LETTERS[sciExp / 3]

	return numberString + letterString
}
