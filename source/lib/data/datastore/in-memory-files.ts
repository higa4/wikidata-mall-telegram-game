import * as fs from 'fs'

import stringify from 'json-stable-stringify'

import {Datastore} from './datastore'

type Dictionary<T> = {[key: string]: T}

const {mkdirSync, readdirSync, readFileSync} = fs
const {writeFile} = fs.promises

export class InMemoryFiles<T> implements Datastore<T> {
	private _inMemoryStorage: Dictionary<T> = {}

	constructor(
		private readonly directory: string
	) {
		mkdirSync(directory, {recursive: true})

		const entries = this._listFromFS()
		for (const e of entries) {
			this._inMemoryStorage[e] = this._getFromFS(e)
		}
	}

	async getAll(): Promise<Dictionary<T>> {
		return this._inMemoryStorage
	}

	async list(): Promise<readonly string[]> {
		return Object.keys(this._inMemoryStorage)
	}

	async get(key: string): Promise<T | undefined> {
		return this._inMemoryStorage[key]
	}

	async set(key: string, value: T): Promise<void> {
		this._inMemoryStorage[key] = value
		const content = stringify(value, {space: 2}) + '\n'
		await writeFile(this._pathOfKey(key), content, 'utf8')
	}

	private _pathOfKey(key: string): string {
		return `${this.directory}/${key}.json`
	}

	private _listFromFS(): readonly string[] {
		return readdirSync(this.directory)
			.map(o => o.replace('.json', ''))
	}

	private _getFromFS(key: string): T {
		const content = readFileSync(this._pathOfKey(key), 'utf8')
		const json = JSON.parse(content)
		return json
	}
}
