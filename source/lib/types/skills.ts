type Dictionary<T> = {[key: string]: T}

/**
 * Contains Skill Levels
 */
export interface Skills {
	/**
	 * Speed increase of
	 */
	applicantSpeed?: number;

	/**
	 * Improves the timespan until people retire
	 */
	healthCare?: number;

	/**
	 * Allows for 'Buy all' and reduces its additional cost
	 */
	magnetism?: number;

	/**
	 * Skill Level per Shop a player ever had
	 */
	collector?: Dictionary<number>;
}

export interface SkillInTraining {
	skill: keyof Skills;
	category?: string;
	endTimestamp: number;
}

type Skill = keyof Skills

export const SIMPLE_SKILLS: Skill[] = [
	'applicantSpeed',
	'healthCare',
	'magnetism'
]

export const CATEGORY_SKILLS: Skill[] = [
	'collector'
]
