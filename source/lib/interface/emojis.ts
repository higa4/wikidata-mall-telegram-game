type Dictionary<T> = {[key: string]: T}

const basic: Dictionary<string> = {
	add: '➕',
	applicantsAvailable: '📬',
	applicantsEmpty: '📭',
	chat: '💭',
	clearSkillQueue: '❌',
	close: '🛑',
	collector: '🧳',
	construction: '🏗',
	countdown: '⏲',
	currency: '📎',
	employmentTermination: '🔫',
	hobby: '💚',
	income: '📈',
	language: '🏳️‍🌈',
	leaderboard: '🏆',
	magnetism: '🧲',
	mall: '🏬',
	noPerson: '🕳',
	opening: '🎈',
	person: '👤',
	purchasing: '🛒',
	recruitment: '👏',
	retirement: '👻',
	seat: '💺',
	selling: '🤝',
	settings: '⚙️',
	shop: '🏪',
	shopProductsEmpty: '🥺',
	skill: '⚗️',
	skillFinished: '✅',
	stats: '📊',
	storage: '📦',
	underConstruction: '🚧',
	warning: '⚠️',
	wikidataItem: 'ℹ️',
	yes: '👍'
}

export const emojis: Dictionary<string> = {
	...basic,
	applicantSeats: basic.seat,
	applicantSpeed: basic.applicantsAvailable,
	healthCare: basic.retirement,
	logistics: basic.shop,
	machinePress: basic.storage,
	metalScissors: basic.purchasing,
	packaging: basic.selling
}
