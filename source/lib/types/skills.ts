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
	 * Skill Level per Shop a player ever had
	 */
	collector?: Dictionary<number>;
}

export interface SkillInTraining {
	skill: keyof Skills;
	product?: string;
	startTimestamp: number;
}
