export function buildCost(existingShops: number): number {
	return 10 ** (existingShops + 2)
}

export function productCost(existingShops: number, existingProducts: number): number {
	return buildCost(existingShops - 1) * existingProducts
}
