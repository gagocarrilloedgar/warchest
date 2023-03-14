import { Directions } from "../Unit"

export interface Position {
	x: number
	y: number
}

export class BoardPosition implements Position {
	public readonly x: number
	public readonly y: number

	constructor(x: number, y: number) {
		this.x = x
		this.y = y
	}

	public static fromPosition(position: Position): BoardPosition {
		return new BoardPosition(position.x, position.y)
	}

	public static fromString(position: string): BoardPosition {
		const [x, y] = position.split(",").map((value) => parseInt(value, 10))

		return new BoardPosition(x, y)
	}

	public isDeltaMoveValid(to: Position, moveDirection: Directions, deltaMove: number): boolean {
		const directionOfMovement = moveDirection

		const distanceDiag = Math.sqrt(Math.pow(to.x - this.x, 2) + Math.pow(to.y - this.y, 2))
		const distanceOrthogonal = Math.max(Math.abs(to.x - this.x), Math.abs(to.x - this.y))

		const distance = directionOfMovement === Directions.DIAGONAL ? distanceDiag : distanceOrthogonal

		return distance <= deltaMove
	}
}
