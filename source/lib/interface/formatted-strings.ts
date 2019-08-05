import WikidataEntityReader from 'wikidata-entity-reader'

import {formatFloat, formatInt} from './format-number'

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
	return `${wdr.label()}: ${formatFloat(num)}${unit}`
}

export function labeledInt(wdr: WikidataEntityReader, num: number, unit = ''): string {
	return `${wdr.label()}: ${formatInt(num)}${unit}`
}
