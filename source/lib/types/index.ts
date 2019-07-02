import {Person} from './people'
import {Shop} from './shop'

export interface Session {
	applicants: Person[];
	applicantTimestamp: number;
	money: number;
	shops: Shop[];
}
