export interface Notification {
	type: 'skillFinished' | 'storeProductsEmpty';
	date: Date;
	text: string;
}
