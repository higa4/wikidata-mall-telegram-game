type Dictionary<T> = {[key: string]: T}

export interface Product {
}

export interface Shop {
	products: Dictionary<Product>;
}
