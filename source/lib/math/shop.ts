export function buildCost(existingShops: number): number {
	return 10 ** existingShops
}

export function productCost(existingShops: number, existingProducts: number): number {
	return buildCost(existingShops) * existingProducts
}
