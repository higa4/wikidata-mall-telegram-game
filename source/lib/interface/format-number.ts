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
	return formatNumber(num, num => num.toPrecision(3))
}

export function formatInt(num: number): string {
	return formatNumber(num, (relevantNumPart, sciExp) =>
		sciExp < 2 ? relevantNumPart.toFixed(0) : relevantNumPart.toPrecision(3)
	)
}
