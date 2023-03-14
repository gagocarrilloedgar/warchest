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

	public execute(answers: string[], player: Player, board: Board): void {
		const control = answers[0]
		const controlPosition = BoardPosition.fromString(control)

		const unit = board.getUnitFromPosition(controlPosition)

		if (!unit) {
			throw new ControlError("There is no unit on this position.")
		}

		if (!player.handContainsUnit(unit.type)) {
			throw new ControlError("You do not have this unit in your hand.")
		}

		player.discardUnit(unit.type)
		player.removeControlToken()
	}
}
