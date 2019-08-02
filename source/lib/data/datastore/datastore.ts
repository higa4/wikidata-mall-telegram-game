type Dictionary<T> = {[key: string]: T}

export interface Datastore<T> {
	get(key: string): Promise<T | undefined>;
	entries(): Promise<Dictionary<T>>;
	keys(): Promise<readonly string[]>;
	set(key: string, value: T): Promise<void>;
}
