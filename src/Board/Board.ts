export interface Position {
	x: number
	y: number
}

export class Board {
	private readonly SIZE: number
	private readonly NEUTRAL_ZONE = "@"
	private readonly EMPTY_ZONE = "."
	private readonly SEPARATOR = " "
	private readonly VERTICAL_SEPARATOR = "|"
	private readonly HORIZONTAL_SEPARATOR = "-"

	private readonly NEUTRAL_ZONES = [
		{ x: 1, y: 2 },
		{ x: 3, y: 1 },
		{ x: 1, y: 3 },
		{ x: 3, y: 2 }
	]

	private readonly board: string[][]

	constructor(size: number) {
		this.SIZE = size
		this.board = this.createBoard()
	}

	public createDrawableBoard(): string {
		const board = this.board.map((row, rowIndex) => {
			const newRow = row.map((column, columnIndex) => {
				return this.isNeutralZone(rowIndex, columnIndex) ? this.NEUTRAL_ZONE : column
			})

			return newRow.join(this.SEPARATOR)
		})

		const boardWithHorizontalSeparators = this.addHorizontalSeparator(board)
		const boardWithVerticalSeparators = this.addVerticalSeparator(boardWithHorizontalSeparators)

		return boardWithVerticalSeparators.join("\n")
	}

	public hashTagSeparator(playerName: string): string {
		return (
			new Array(5).fill(" # ").join("") +
			playerName.toUpperCase() +
			new Array(5).fill(" # ").join("")
		)
	}

	private createBoard(): string[][] {
		return Array.from({ length: this.SIZE }, () =>
			Array.from({ length: this.SIZE }, () => this.EMPTY_ZONE)
		)
	}

	private addHorizontalSeparator(boardRows: string[]): string[] {
		const separators = new Array(this.SIZE).fill(this.HORIZONTAL_SEPARATOR).join("-")
		const indexes = Array(this.SIZE)
			.fill(this.HORIZONTAL_SEPARATOR)
			.map((_, index) => {
				return index.toString()
			})
			.join(this.SEPARATOR)

		return [indexes, separators, ...boardRows]
	}

	private addVerticalSeparator(boardRows: string[]): string[] {
		return boardRows.map((row, index) => {
			if (index === 0 || index === 1) {
				return `    ${row}`
			}

			return `${index - 2} ${this.VERTICAL_SEPARATOR} ${row}`
		})
	}

	private isNeutralZone(rowIndex: number, columnIndex: number) {
		return this.NEUTRAL_ZONES.some((zone) => zone.x === rowIndex && zone.y === columnIndex)
	}
}
