import {Person} from './people'

export interface Product {
	id: string;
	personal: Personal;
}

interface Personal {
	purchasing?: Person;
	selling?: Person;
	storage?: Person;
}

export interface Shop {
	id: string;
	products: Product[];
}
