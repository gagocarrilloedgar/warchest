import { ActionType, ActionTypes } from "../Actions/Action"
import { UnitType } from "../Unit/UnitType"
import { Hand } from "./Hand"
import { PlayerBag } from "./PlayerBag"

export interface PlayerTurnInfo {
	name: string
	controlTokens: number
	hand: UnitType[]
	recruits: { quanity: number; type: string }[]
	discards: { quanity: number; type: string }[]
}

export class Player {
	private readonly hand: Hand
	private readonly recruits: { quanity: number; type: string }[]
	private readonly discards: { quanity: number; type: string }[]
	private readonly controlTokens: number
	private readonly name: string
	private readonly currentAction: ActionType | undefined
	private readonly bag: PlayerBag

	constructor(name: string, conrolTokens: number) {
		this.name = name
		this.bag = new PlayerBag()
		this.hand = new Hand(this.bag.getThreeRandomUnits())
		this.recruits = []
		this.discards = []
		this.controlTokens = conrolTokens
	}

	public getPlayerInfo(): PlayerTurnInfo {
		return {
			name: this.name,
			controlTokens: this.controlTokens,
			hand: this.hand.getUnitTypesAvailable(),
			recruits: this.recruits,
			discards: this.discards
		}
	}

	public nextAction(action: ActionType): boolean {
		if (action.value === ActionTypes.FORFEIT) {
			console.log(`Player ${this.name} has forfeited the game!`)

			return false
		}

		return true
	}
}
