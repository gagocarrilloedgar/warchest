import { Board } from "../Board"
import { Player } from "../Player"
import { BoardPosition } from "../shared"
import { Action, ActionType, ActionTypes } from "./Action"

class MoveError extends Error {
	constructor(message: string) {
		super(`MoveError: ${message}`)
	}
}

export class Move implements Action {
	public readonly type: ActionType = new ActionType(ActionTypes.MOVE)
	public readonly movements = [
		"Which unit do you want to move? (initial position: y,x)",
		"Where do you want to move? (final position: y,x)"
	]

	public execute(answers: string[], player: Player, board: Board): void {
		const from = answers[0]
		const to = answers[1]

		const fromPosition = BoardPosition.fromString(from)
		const toPosition = BoardPosition.fromString(to)

		const unitToMove = board.getUnitFromPosition(fromPosition)
		const hand = player.playerInfo.hand
		const playerName = player.playerInfo.name

		if (!board.doesPositionContainUnit(fromPosition)) {
			throw new MoveError("There is no unit on this position.")
		}

		if (!board.isPositionOwnedByPlayer(fromPosition, playerName)) {
			throw new MoveError("This unit is not yours.")
		}

		if (!board.isPositionFree(toPosition)) {
			throw new MoveError("This position is not free.")
		}

		if (!unitToMove) {
			throw new MoveError("There is no unit on this position.")
		}

		if (!hand.containsUnitType(unitToMove.type)) {
			throw new MoveError("You do not have this unit in your hand.")
		}

		if (
			!fromPosition.isDeltaMoveValid(toPosition, unitToMove.moveDirection, unitToMove.deltaMove)
		) {
			throw new MoveError("This unit cannot move that far.")
		}

		board.moveUnitOnBoard(unitToMove, fromPosition, toPosition, player)
		hand.removeSelectedUnit(unitToMove)
		player.playerInfo.discards.addUnit(unitToMove.type)
	}
}
