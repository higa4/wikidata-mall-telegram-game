export interface Person {
	name: Name;
	hobby: string;

	/**
	 * The percentage of income the person gets when hired
   */
	profitShare: number;

	retirementTimestamp: number;

	/**
	 * @deprecated Currently not in use. May be used later on and is still generated on new applicants
	 */
	salery: number;

	talents: Talents;
}

export interface Name {
	given: string;
	family: string;
}

export interface Talents {
	purchasing: number;
	selling: number;
	storage: number;
}

export type TalentName = keyof Talents
export const TALENTS: TalentName[] = ['purchasing', 'selling', 'storage']
