import { Board } from "../Board"
import { Player } from "../Player"
import { BoardPosition } from "../shared"
import { Action, ActionType, ActionTypes } from "./Action"

class ControlError extends Error {
	constructor(message: string) {
		super(`ControlError: ${message}`)
	}
}

export class Control implements Action {
	public readonly type: ActionType = new ActionType(ActionTypes.CONTROL)

	movements: string[] = ["Please select the unit you want to control (y, x): "]

	public async execute(answers: string[], board: Board, player: Player): Promise<void> {
		try {
			const control = answers[0]
			const controlPosition = BoardPosition.fromString(control)

			const unit = board.getBoard[controlPosition.x][controlPosition.y].unit
			const hand = player.playerInfo.hand

			if (!unit) {
				throw new ControlError("There is no unit on this position.")
			}

			if (!hand.containsUnitType(unit.type)) {
				throw new ControlError("You do not have this unit in your hand.")
			}

			// We remove the unit from the player's hand
			hand.removeSelectedUnit(unit)

			// We add the unit to the discard pile
			player.playerInfo.discards.addUnit(unit.type)

			// We remove one control token from the player
			player.playerInfo.controlTokens -= 1
		} catch (error: ControlError | unknown) {
			if (error instanceof Error) {
				console.log(error.message)
			}
			await this.execute(answers, board, player)
		}
	}
}
