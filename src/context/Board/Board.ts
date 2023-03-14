import { Player } from "../Player/Player"
import { Unit } from "../Unit/Unit"

export interface Position {
	x: number
	y: number
}

export interface TableBoardPosition {
	value: string
	controlledBy: Player | null
	unit: Unit | null
}

export class Board {
	private readonly SIZE: number
	private readonly NEUTRAL_ZONE = "@"
	private readonly EMPTY_ZONE = "."
	private readonly SEPARATOR = " "
	private readonly VERTICAL_SEPARATOR = "|"
	private readonly HORIZONTAL_SEPARATOR = "-"

	private readonly NEUTRAL_ZONES = [
		{ x: 1, y: 1, value: "@" },
		{ x: 1, y: 3, value: "@" },
		{ x: 3, y: 3, value: "@" },
		{ x: 3, y: 1, value: "@" }
	]

	private readonly WOLF_ZONES = [{ x: 4, y: 2 }]
	private readonly CROWN_ZONES = [{ x: 0, y: 2 }]

	private readonly board: TableBoardPosition[][]

	constructor(size: number) {
		this.SIZE = size
		this.board = this.createBoard()
	}

	public createDrawableBoard(isInit?: boolean): string {
		const board = isInit
			? this.getInitialBoard()
			: this.board.map((row) => row.map((column) => column.value).join(this.SEPARATOR))

		const boardWithHorizontalSeparators = this.addHorizontalSeparator(board)
		const boardWithVerticalSeparators = this.addVerticalSeparator(boardWithHorizontalSeparators)

		return boardWithVerticalSeparators.join("\n")
	}

	public getInitialBoard(): string[] {
		return this.board.map((row, rowIndex) => {
			const newRow = row.map((column, columnIndex) => {
				const zone = this.isControlZone(this.NEUTRAL_ZONES, rowIndex, columnIndex)
					? this.NEUTRAL_ZONE
					: this.isControlZone(this.WOLF_ZONES, rowIndex, columnIndex)
					? "W"
					: this.isControlZone(this.CROWN_ZONES, rowIndex, columnIndex)
					? "C"
					: column.value

				this.board[rowIndex][columnIndex].value = zone

				return zone
			})

			return newRow.join(this.SEPARATOR)
		})
	}

	public hashTagSeparator(playerName: string): string {
		return (
			new Array(5).fill(" # ").join("") +
			playerName.toUpperCase() +
			new Array(5).fill(" # ").join("")
		)
	}

	public placeUnitOnBoard(unit: Unit, position: Position): void {
		if (!this.checkIfPositionIsInBoard({ x: position.x, y: position.y })) {
			throw new Error("Position is not in board")
		}

		this.board[position.x][position.y].value = unit.type.getAcronym()
		this.board[position.x][position.y].unit = unit
		this.board[position.x][position.y].controlledBy = null
	}

	public controlZone(unit: Unit, position: Position, player: Player): void {
		if (!this.checkIfPositionIsInBoard({ x: position.x, y: position.y })) {
			throw new Error("Position is not in board")
		}

		const isPotentialControlZone = this.isControlZone(this.NEUTRAL_ZONES, position.x, position.y)
		const isUnitInZone = this.board[position.x][position.y].value === unit.type.getAcronym()

		if (!isPotentialControlZone) {
			throw new Error("Position is not a control zone")
		}

		if (!isUnitInZone) {
			throw new Error("Unit is not in control zone")
		}

		this.board[position.x][position.y].controlledBy = player
		const isWolf = player.playerInfo.name === "wolf"

		this.NEUTRAL_ZONES.splice(
			this.NEUTRAL_ZONES.findIndex((zone) => zone.x === position.x && zone.y === position.y),
			1
		)

		if (isWolf) {
			this.WOLF_ZONES.push({ x: position.x, y: position.y })
		} else {
			this.CROWN_ZONES.push({ x: position.x, y: position.y })
		}
	}

	public moveUnitOnBoard(unit: Unit, from: Position, to: Position): void {
		if (!this.checkIfPositionIsInBoard({ x: from.x, y: from.y })) {
			throw new Error("Position is not in board")
		}

		this.board[from.x][from.y].value = this.EMPTY_ZONE
		this.board[from.x][from.y].unit = null
		this.board[from.x][from.y].controlledBy = null

		this.placeUnitOnBoard(unit, to)
	}

	public addControlledZones(wolf: Player, crown: Player): void {
		this.board.forEach((row, rowIndex) => {
			row.forEach((_column, columnIndex) => {
				const zone = this.isControlZone(this.WOLF_ZONES, rowIndex, columnIndex)
					? wolf
					: this.isControlZone(this.CROWN_ZONES, rowIndex, columnIndex)
					? crown
					: null

				this.board[rowIndex][columnIndex].controlledBy = zone
			})
		})
	}

	public getControlledZones(): { wolf: number; crown: number } {
		return {
			wolf: this.WOLF_ZONES.length,
			crown: this.CROWN_ZONES.length
		}
	}

	public doesPositionContainUnit(position: Position): boolean {
		return this.board[position.x][position.y].unit !== null
	}

	public getUnitFromPosition(position: Position): Unit | null {
		return this.board[position.x][position.y].unit
	}

	public isPositionOwnedByPlayer(position: Position, playerName: string): boolean {
		return this.board[position.x][position.y].controlledBy?.playerInfo.name === playerName
	}

	public isPositionFree(position: Position): boolean {
		return (
			this.board[position.x][position.y].controlledBy === null &&
			!this.doesPositionContainUnit(position)
		)
	}

	public hasPositionAdjacentControlZone(position: Position, playerName: string): boolean {
		const { x, y } = position

		const leftPosition =
			x - 1 >= 0 && this.board[x - 1][y].controlledBy?.playerInfo.name === playerName

		const rightPosition =
			x + 1 < this.board.length && this.board[x + 1][y].controlledBy?.playerInfo.name === playerName

		const topPosition =
			y - 1 >= 0 && this.board[x][y - 1].controlledBy?.playerInfo.name === playerName

		const bottomPosition =
			y + 1 < this.board[0].length &&
			this.board[x][y + 1].controlledBy?.playerInfo.name === playerName

		return leftPosition || rightPosition || topPosition || bottomPosition
	}

	private createBoard(): { value: string; controlledBy: Player | null; unit: Unit | null }[][] {
		return Array.from({ length: this.SIZE }, () =>
			Array.from({ length: this.SIZE }, () => {
				return {
					value: this.EMPTY_ZONE,
					controlledBy: null,
					unit: null
				}
			})
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

	private isControlZone(controlZones: Position[], row: number, col: number) {
		return controlZones.some((zone) => zone.x === row && zone.y === col)
	}

	private checkIfPositionIsInBoard(position: Position): boolean {
		return position.x >= 0 && position.x < this.SIZE && position.y >= 0 && position.y < this.SIZE
	}
}
