import {Person} from './people'
import {Shop} from './shop'

type Dictionary<T> = {[key: string]: T}

export interface Session {
	applicants: Person[];
	applicantTimestamp: number;
	shops: Dictionary<Shop>;
}
