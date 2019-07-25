type Dictionary<T> = {[key: string]: T}
type UnixTimestamp = number

export type AchievementSet = Dictionary<UnixTimestamp>

export interface Achievements {
	gameStarted: UnixTimestamp;
	shopsOpened?: AchievementSet;
}
