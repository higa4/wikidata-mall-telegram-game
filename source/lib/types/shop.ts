import {Person} from './people'

export interface Product {
	id: string;
	itemsInStore: number;
	itemTimestamp: number;
}

export interface Personal {
	purchasing?: Person;
	selling?: Person;
	storage?: Person;
}

export interface Shop {
	id: string;
	opening: number;
	personal: Personal;
	products: Product[];
}

export interface Construction {
	possibleShops: string[];
}
