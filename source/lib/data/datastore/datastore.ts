export interface Datastore<T> {
	list(): Promise<readonly string[]>;
	get(key: string): Promise<T | undefined>;
	set(key: string, value: T): Promise<void>;
}
