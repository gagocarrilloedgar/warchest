import { Board } from "../Board/Board"
import { Player } from "../Player/Player"
import { BoardPosition, Position } from "../shared/Position"
import { Directions, Unit } from "../Unit/Unit"
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

			console.log({ fromPosition })
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
