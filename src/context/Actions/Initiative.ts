import { Player } from "../Player"
import { Unit, UnitType, UnitTypes } from "../Unit"
import { Action, ActionType, ActionTypes } from "./Action"

class InitiativeError extends Error {
	constructor(message: string) {
		super(`PlaceError: ${message}`)
	}
}

/**
 * @description This action is give the player the initiative to play first in the next round
 */
export class Initiative implements Action {
	public readonly type: ActionType = new ActionType(ActionTypes.INITIATIVE)

	movements: string[] = ["Select the unit you want to give the initiative to from your hand: "]

	public execute(answers: string[], player: Player): void {
		const unitName = answers[0]
		const unitType = UnitType.fromValue(unitName.toUpperCase() as UnitTypes)
		const newUnit = new Unit(unitType)

		if (!player.handContainsUnit(unitType)) {
			throw new InitiativeError("Unit not available in hand.")
		}

		player.discardUnit(newUnit.type)
		player.addInitiativeToken()
	}
}
