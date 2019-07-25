import {Achievements, Stats} from './achievements'
import {Person} from './people'
import {Shop} from './shop'

// Contains smaller things only relevant to a specific player
export interface Session {
	achievements: Achievements;
	applicants: Person[];
	applicantTimestamp: number;
	money: number;
	stats: Stats;
}

// Contains things that are stored outside of the session
export interface Persist {
	shops: Shop[];
}
