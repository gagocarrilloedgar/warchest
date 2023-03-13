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
}
