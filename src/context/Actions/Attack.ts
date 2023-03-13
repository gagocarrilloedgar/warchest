import { Board } from "../Board"
import { Player } from "../Player"
import { BoardPosition, Position } from "../shared"
import { Directions, Unit } from "../Unit"
import { Action, ActionType, ActionTypes } from "./Action"

class AttackError extends Error {
	constructor(message: string) {
		super(`MoveError: ${message}`)
	}
}

export class Attack implements Action {
	public readonly type: ActionType = new ActionType(ActionTypes.ATTACK)

	public movements: string[] = [
		"Which unit do you want to attack with? (initial position: y,x)",
		"Which unit do you want to attack? (final position: y,x)"
	]

	public async execute(answers: string[], board: Board, player: Player): Promise<void> {
		try {
			const from = answers[0]
			const fromPosition = BoardPosition.fromString(from)
			const to = answers[1]
			const toPosition = BoardPosition.fromString(to)

			const attackUnit = board.getBoard[fromPosition.x][fromPosition.y].unit
			const hand = player.playerInfo.hand
			const discards = player.playerInfo.discards

			const enemy = board.getBoard[fromPosition.x][fromPosition.y].controlledBy

			if (!attackUnit) {
				throw new AttackError("There is no unit on this position.")
			}

			if (!this.isStartPositionOwnedByPlayer(board, fromPosition, player)) {
				throw new AttackError("This unit is not yours.")
			}

			if (!hand.containsUnitType(attackUnit.type)) {
				throw new AttackError("You do not have this unit in your hand.")
			}

			if (!this.isDeltaMoveValid(fromPosition, toPosition, attackUnit)) {
				throw new AttackError("This unit cannot move that far.")
			}

			if (!enemy || !this.isEndPositionControlledByEnemy(board, toPosition, player)) {
				throw new AttackError("This position is not controlled by an enemy.")
			}

			// We move the unit at the board level
			board.moveUnitOnBoard(attackUnit, fromPosition, fromPosition, player)

			// We remove the unit from the player's hand
			hand.removeSelectedUnit(attackUnit)

			// We add the unit to the discard pile
			discards.addUnit(attackUnit.type)
		} catch (error: unknown) {
			if (error instanceof AttackError) {
				console.log(error.message)
			}

			await this.execute(answers, board, player)
		}
	}

	private isStartPositionOwnedByPlayer(board: Board, from: Position, player: Player): boolean {
		const { x, y } = from

		return board.getBoard[x][y].controlledBy?.playerInfo.name === player.playerInfo.name
	}

	private isEndPositionControlledByEnemy(board: Board, to: Position, player: Player): boolean {
		const { x, y } = to

		const enemy = board.getBoard[x][y].controlledBy

		return !enemy || !(enemy.playerInfo.name === player.playerInfo.name)
	}

	private isDeltaMoveValid(from: Position, to: Position, unit: Unit): boolean {
		const { x: x1, y: y1 } = from
		const { x: x2, y: y2 } = to

		const directionOfMovement = unit.moveDirection

		const distanceDiag = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
		const distanceOrthogonal = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1))

		const distance = directionOfMovement === Directions.DIAGONAL ? distanceDiag : distanceOrthogonal

		return distance <= unit.deltaMove
	}
}
