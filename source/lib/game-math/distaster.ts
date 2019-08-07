
/**
 * Returns the probability (0-1) for the given age
 */
export function destructionProbability(ageInDays: number): number {
	return 1 - Math.exp(ageInDays * -0.0005)
}
