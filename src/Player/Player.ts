export interface PlayerTurnInfo {
	name: string
	controlTokens: number
	hand: string[]
	recruits: { quanity: number; type: string }[]
	discards: { quanity: number; type: string }[]
}

export class Player {
	private readonly hand: string[]
	private readonly recruits: { quanity: number; type: string }[]
	private readonly discards: { quanity: number; type: string }[]
	private readonly controlTokens: number
	private readonly name: string

	constructor(name: string, conrolTokens: number) {
		this.name = name
		this.hand = []
		this.recruits = []
		this.discards = []
		this.controlTokens = conrolTokens
	}

	public getPlayerInfo(): PlayerTurnInfo {
		return {
			name: this.name,
			controlTokens: this.controlTokens,
			hand: this.hand,
			recruits: this.recruits,
			discards: this.discards
		}
	}
}
