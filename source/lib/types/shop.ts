import {Person} from './people'

export interface Product {
	id: string;
	itemsInStore: number;
	itemTimestamp: number;
}

interface Personal {
	purchasing?: Person;
	selling?: Person;
	storage?: Person;
}

export interface Shop {
	id: string;
	personal: Personal;
	products: Product[];
}
