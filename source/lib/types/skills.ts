type Dictionary<T> = {[key: string]: T}
type SkillCategorySet = Dictionary<number>

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
	 * Improve purchase cost of products
	 */
	metalScissors?: number;

	/**
	 * Skill Level per Shop a player ever had
	 */
	collector?: SkillCategorySet;

	/**
	 * Improve storage capacity for the category
	 */
	machinePress?: SkillCategorySet;

	/**
	 * Improve product sell price for the category
	 */
	packaging?: SkillCategorySet;
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
	'magnetism',
	'metalScissors'
]

export const CATEGORY_SKILLS: Skill[] = [
	'collector',
	'machinePress',
	'packaging'
]
