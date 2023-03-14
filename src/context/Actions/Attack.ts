import { Board } from "../Board"
import { Player } from "../Player"
import { BoardPosition } from "../shared"
import { Action, ActionType, ActionTypes } from "./Action"

class AttackError extends Error {
	constructor(message: string) {
		super(`AttackError: ${message}`)
	}
}

export class Attack implements Action {
	public readonly type: ActionType = new ActionType(ActionTypes.ATTACK)

	public movements: string[] = [
		"Which unit do you want to attack with? (initial position: y,x)",
		"Which unit do you want to attack? (final position: y,x)"
	]

	public execute(answers: string[], player: Player, board: Board): void {
		const from = answers[0]
		const to = answers[1]

		const fromPosition = BoardPosition.fromString(from)
		const toPosition = BoardPosition.fromString(to)

		const hand = player.playerInfo.hand
		const discards = player.playerInfo.discards
		const playerName = player.playerInfo.name

		const attackUnit = board.getUnitFromPosition(fromPosition)

		if (!attackUnit) {
			throw new AttackError("There is no unit on this position.")
		}

		if (!board.isPositionOwnedByPlayer(fromPosition, playerName)) {
			throw new AttackError("This unit is not yours.")
		}

		if (!hand.containsUnitType(attackUnit.type)) {
			throw new AttackError("You do not have this unit in your hand.")
		}

		if (
			!fromPosition.isDeltaMoveValid(toPosition, attackUnit.moveDirection, attackUnit.deltaMove)
		) {
			throw new AttackError("This unit cannot move that far.")
		}

		if (
			board.isPositionFree(toPosition) &&
			board.isPositionOwnedByPlayer(fromPosition, playerName)
		) {
			throw new AttackError("This position is not controlled by an enemy.")
		}

		// We move the unit at the board level
		board.moveUnitOnBoard(attackUnit, fromPosition, fromPosition, player)

		// We remove the unit from the player's hand
		hand.removeSelectedUnit(attackUnit)

		// We add the unit to the discard pile
		discards.addUnit(attackUnit.type)
	}
}
