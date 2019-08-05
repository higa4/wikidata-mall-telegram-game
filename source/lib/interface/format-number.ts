import {scientificExponent} from '../math/number'

const LETTERS = ['', 'k', 'M', 'G', 'T', 'P', 'E']

function formatNumber(num: number, formatRelevantNumber: (relevantNumPart: number, scientificExponent: number) => string): string {
	const sciExp = scientificExponent(num)
	const sciNum = 10 ** sciExp
	const relevantNumPart = num / sciNum
	const numberString = formatRelevantNumber(relevantNumPart, sciExp)

	const letterString = LETTERS[sciExp / 3]

	return numberString + letterString
}

export function formatFloat(num: number): string {
	return formatNumber(num, num => num.toFixed(2))
}

export function formatInt(num: number): string {
	return formatNumber(num, (relevantNumPart, sciExp) => {
		const fractionDigits = sciExp < 2 ? 0 : 2
		return relevantNumPart.toFixed(fractionDigits)
	})
}
