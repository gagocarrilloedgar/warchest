import { ActionType, ActionTypes } from "../Actions/Action"
import { ActionFactory } from "../Actions/ActionFactory"
import { UnitType, UnitTypes } from "../Unit/UnitType"
import { Hand } from "./Hand"
import { PlayerBag } from "./PlayerBag"
import { PlayerRecruitment, UnitCollection } from "./PlayerRecruitment"

export interface PlayerTurnInfo {
	name: string
	controlTokens: number
	hand: UnitType[]
	recruits: UnitCollection[]
	discards: { quanity: number; type: string }[]
}

export class Player {
	private readonly hand: Hand
	private readonly recruits: PlayerRecruitment
	private readonly discards: { quanity: number; type: string }[]
	private readonly controlTokens: number
	private readonly name: string
	private readonly currentAction: ActionType | undefined
	private readonly bag: PlayerBag
	private readonly UNITS_FOR_THE_BAG = 2

	constructor(name: string, conrolTokens: number, playerTypes: UnitTypes[]) {
		this.name = name

		this.recruits = new PlayerRecruitment(playerTypes, this.UNITS_FOR_THE_BAG)
		this.bag = new PlayerBag(playerTypes, this.UNITS_FOR_THE_BAG)
		this.hand = new Hand(this.bag.getThreeRandomUnits())

		this.discards = []
		this.controlTokens = conrolTokens
	}

	public getPlayerInfo(): PlayerTurnInfo {
		return {
			name: this.name,
			controlTokens: this.controlTokens,
			hand: this.hand.getUnitTypesAvailable(),
			recruits: this.recruits.getAvailableUnits(),
			discards: this.discards
		}
	}

	public nextAction(action: ActionType): boolean {
		if (action.value === ActionTypes.FORFEIT) {
			console.log(`Player ${this.name} has forfeited the game!`)

			return false
		}

		const newAction = ActionFactory.create(action)
		newAction.execute()

		return true
	}
}
