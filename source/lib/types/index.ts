import {Achievements} from './achievements'
import {Person} from './people'
import {Shop} from './shop'

export interface Session {
	achievements: Achievements;
	applicants: Person[];
	applicantTimestamp: number;
	money: number;
	shops: Shop[];
}
