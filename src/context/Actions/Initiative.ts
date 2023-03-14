import { Board } from "../Board"
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

	public async execute(answers: string[], board: Board, player: Player): Promise<void> {
		try {
			const unitName = answers[0]
			const hand = player.playerInfo.hand
			const discards = player.playerInfo.discards

			const unitType = UnitType.fromValue(unitName.toUpperCase() as UnitTypes)
			const newUnit = new Unit(unitType)

			const isAvailable = hand.containsUnitType(unitType)

			if (!isAvailable) {
				throw new InitiativeError("Unit not available in hand.")
			}

			// If everything is ok, we remove the unit from the player's hand
			// hand.removeSelectedUnit(newUnit)
			// Then we add the unit to the discard pile
			// discards.addUnit(unitType)
			// Then we add the initiative token to the player
			player.addInitiativeToken()
		} catch (error) {
			if (error instanceof InitiativeError) {
				console.log(error.message)
			}
			await this.execute(answers, board, player)
		}
	}
}
