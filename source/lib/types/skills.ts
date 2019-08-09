type Dictionary<T> = {[key: string]: T}
type SkillCategorySet = Dictionary<number>

/**
 * Contains Skill Levels
 */
export interface SimpleSkills {
	/**
	 * Speed increase of
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
	 * Allows for 'Buy all' and reduces its additional cost
	 */
	magnetism?: number;

	/**
	 * Improve purchase cost of products
	 */
	metalScissors?: number;

}

export interface CategorySkills {
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

export interface Skills extends SimpleSkills, CategorySkills {
}

export interface SkillInTraining {
	skill: keyof Skills;
	category?: string;
	endTimestamp: number;
}

export type SimpleSkill = keyof SimpleSkills
export type CategorySkill = keyof CategorySkills
export type Skill = SimpleSkill | CategorySkill

export const SIMPLE_SKILLS: SimpleSkill[] = [
	'applicantSpeed',
	'healthCare',
	'logistics',
	'magnetism',
	'metalScissors'
]

export const CATEGORY_SKILLS: CategorySkill[] = [
	'collector',
	'machinePress',
	'packaging'
]
