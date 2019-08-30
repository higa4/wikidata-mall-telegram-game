type Dictionary<T> = {[key: string]: T}

export interface Datastore<T> {
	delete(key: string): Promise<void>;
	entries(): Promise<Dictionary<T>>;
	get(key: string): Promise<T | undefined>;
	keys(): Promise<readonly string[]>;
	set(key: string, value: T): Promise<void>;
}
