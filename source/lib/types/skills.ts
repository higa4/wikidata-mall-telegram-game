type Dictionary<T> = {[key: string]: T}
type SkillCategorySet = Dictionary<number>

/**
 * Contains Skill Levels
 */
export interface SimpleSkills {
	/**
	 * Increase number of applicant seats available
	 */
	applicantSeats?: number;

	/**
	 * Speed increase of incoming applicants
	 */
	applicantSpeed?: number;

	/**
	 * Improves the timespan until people retire
	 */
	healthCare?: number;

	/**
	 * Improves the amount of products possible per shop
	 */
	logistics?: number;

	/**
	 * Improve storage capacity for the category
	 */
	machinePress?: number;

	/**
	 * Allows for 'Buy all' and reduces its additional cost
	 */
	magnetism?: number;

	/**
	 * Improve purchase cost of products
	 */
	metalScissors?: number;

	/**
	 * Improve product sell price for the category
	 */
	packaging?: number;
}

export interface CategorySkills {
	/**
	 * Skill Level per Shop a player ever had
	 */
	collector?: SkillCategorySet;
}

export interface Skills extends SimpleSkills, CategorySkills {
}

export interface SkillInTraining {
	skill: Skill;
	category?: string;
	endTimestamp: number;
}

export type SimpleSkill = keyof SimpleSkills
export type CategorySkill = keyof CategorySkills
export type Skill = SimpleSkill | CategorySkill

export const SIMPLE_SKILLS: SimpleSkill[] = [
	'applicantSeats',
	'applicantSpeed',
	'healthCare',
	'logistics',
	'machinePress',
	'magnetism',
	'metalScissors',
	'packaging'
]

export const CATEGORY_SKILLS: CategorySkill[] = [
	'collector'
]
