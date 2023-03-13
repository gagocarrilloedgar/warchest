import { Board } from "../Board/Board"
import { Player } from "../Player/Player"
import { BoardPosition, Position } from "../shared/Position"
import { Directions, Unit } from "../Unit/Unit"
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

	public async execute(answers: string[], board: Board, player: Player): Promise<void> {
		try {
			const from = answers[0]
			const to = answers[1]

			const fromPosition = BoardPosition.fromString(from)
			const toPosition = BoardPosition.fromString(to)

			const unitToMove = board.getBoard[fromPosition.x][fromPosition.y].unit

			if (!this.doesPositionContainUnit(board, fromPosition)) {
				throw new MoveError("There is no unit on this position.")
			}

			if (!this.isStartPositionOwnedByPlayer(board, fromPosition, player)) {
				throw new MoveError("This unit is not yours.")
			}

			if (unitToMove && !this.isDeltaMoveValid(fromPosition, toPosition, unitToMove)) {
				throw new MoveError("This unit cannot move that far.")
			}

			if (!this.isEndPositionFree(board, toPosition)) {
				throw new MoveError("This position is not free.")
			}

			if (unitToMove) {
				board.moveUnitOnBoard(unitToMove, fromPosition, toPosition, player)
			}
		} catch (error: MoveError | unknown) {
			if (error instanceof Error) {
				console.log(error.message)
			}

			await this.execute(answers, board, player)
		}
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

	private isEndPositionFree(board: Board, to: Position): boolean {
		const { x, y } = to

		return board.getBoard[x][y].controlledBy === null && board.getBoard[x][y].unit === null
	}

	private isStartPositionOwnedByPlayer(board: Board, from: Position, player: Player): boolean {
		const { x, y } = from

		return board.getBoard[x][y].controlledBy?.playerInfo.name === player.playerInfo.name
	}

	private doesPositionContainUnit(board: Board, position: Position): boolean {
		const { x, y } = position

		return board.getBoard[x][y].unit !== null
	}
}
