import { ActionType, ActionTypes } from "../Actions/Action"
import { PromptQuestion } from "../shared/Prompter"
import { Unit } from "../Unit/Unit"
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
	private readonly bag: PlayerBag
	private readonly UNITS_FOR_THE_BAG = 2
	private readonly unitsInBoard: {
		position: {
			x: number
			y: number
		}
		unit: Unit
	}[]

	constructor(name: string, conrolTokens: number, playerTypes: UnitTypes[]) {
		this.name = name
		this.unitsInBoard = []
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

	public async nextAction(
		action: ActionType,
		propmpter: PromptQuestion
	): Promise<{ position: { x: number; y: number }; unit: Unit } | null> {
		if (action.value === ActionTypes.FORFEIT) {
			console.log(`Player ${this.name} has forfeited the game!`)

			return null
		}

		if (action.value === ActionTypes.PLACE) {
			try {
				const unitTypeString = await propmpter.prompt("Which unit would you like to place?")

				const unitType = UnitType.fromValue(unitTypeString.toUpperCase() as UnitTypes)
				const newUnit = new Unit(unitType)

				const answer2 = await propmpter.prompt("Where would you like to place it?")

				const [x, y] = answer2.split(",").map((value) => parseInt(value, 10))

				this.hand.removeSelectedUnit(newUnit)
				this.placeUnitOnBoard(new Unit(unitType), { x, y })

				return {
					position: { x, y },
					unit: newUnit
				}
			} catch (error) {
				console.log("Please enter a valid unit type.")
				await this.nextAction(action, propmpter)
			}
		}

		return null
	}

	public placeUnitOnBoard(unit: Unit, position: { x: number; y: number }): void {
		this.unitsInBoard.push({ position, unit })
	}
}
