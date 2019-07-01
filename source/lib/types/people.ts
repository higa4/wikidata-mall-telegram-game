export interface Person {
	name: Name;
	hobby: string;
	talents: Talents;
}

export interface Name {
	given: string;
	family: string;
}

export interface Talents {
	purchasing: number;
	selling: number;
}

export type TalentName = keyof Talents
export const TALENTS: TalentName[] = ['purchasing', 'selling']
