export interface Notification {
	type: 'skillFinished' | 'storeProductsEmpty' | 'employeeRetired';
	date: Date;
	text: string;
}
